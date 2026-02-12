import type { RequiredBy } from "./types.ts";
import type { Component, GetSlot, SlotData, Message, Response, SessionData, GetComponent, ComponentData, AddSlot, SuccessResponse, UpdateSlot, RemoveSlot, AddComponent, UpdateComponent, RemoveComponent, DataModelOperation, DataModelOperationBatch, BatchResponse } from "./models/index.ts";
import type { MakeComponentPartialForAdd, MakeComponentPartialForUpdate, NewEntityId, SlotPartial } from "./index.ts";

/**
 * Here's a list of undiserable behaviours you may run into :
 * 
 * If mismatched types get sent from the client to the server (e.g. `4.2` when `$type` is `"int"`), the server won't respond. 
 * There are no checks when sending the request. You have to prevent mismatched types yourself. 
 * 
 * When writing a `sendRequest({...})`, if the value of `$type` isn't written first, intellisense will only suggest the value of the first valid overload. 
 * (e.g. only `"addSlot"` when `"updateSlot"` is possible)
 * 
 * `Response` is the name of a default typescript type. When using ResoniteLink's `Response` type, make sure that you are actually importing it.
 * 
 * Some requests may fail while having an effect on the data model. 
 * (e.g. `"updateSlot"` with `data.children = []` sends an error, but the slot will still be modified.)
 */
export class ResoniteLinkClient{
    private socket: WebSocket | null = null
    private awaitingPromises: Map<string, [(res: Response) => void, (res: Response) => void]> = new Map()

    private listeners: Record<string, (() => void)[]> = {
        open: [],
        close: []
    }

    /** Returns a promise that resolves when the socket is opened. It is rejected if the socket closes without opening.
     * 
     * If you are using event listeners, you probably want to add them before calling `connect`. */
    connect(url: string | URL): Promise<void> {
        return new Promise<void>((res, rej) => {
            if(this.socket !== null) this.socket.close()
            this.socket = new WebSocket(url)
    
            this.socket.addEventListener("open", () => {
                res()
                for(const listener of this.listeners["open"]) listener()
            })
            this.socket.addEventListener("close", () => {
                rej(new Error(`Failed to connect to ${url}.`))
                for(const listener of this.listeners["close"]) listener()
            })

            this.socket.addEventListener("message", x => {
                const data = JSON.parse(x.data) as Response
    
                if(this.awaitingPromises.has(data.sourceMessageId!)){
                    const messageId = data.sourceMessageId!
                    const [resolve, reject] = this.awaitingPromises.get(messageId)!
                    this.awaitingPromises.delete(messageId)
    
                    if(data.success) resolve(data)
                    else reject(data)
                } else {
                    console.error(data)
                    throw new Error(`Received a message (${data.sourceMessageId}) without a matching Promise.`)
                }
            })
        })
    }
    disconnect(){
        if(this.socket !== null){
            this.socket.close()
            this._sessionId = null
            this.awaitingPromises.clear()
        }
    }

    addEventListener(type: "open" | "close", listener: () => void){
        this.listeners[type].push(listener)
    }
    removeEventListener(type: "open" | "close", listener: () => void){
        const i = this.listeners[type].indexOf(listener)
        if(i > 0) this.listeners[type].splice(i, 1)
    }

    get readyState(): number {
        if(this.socket) return this.socket.readyState
        return WebSocket.CLOSED
    }

    // --- //

    private messageId = 0
    private getMessageId(){ return this.messageId++ } // Unique message id

    private _sessionId: string | null = null
    get sessionId(): string | null { return this._sessionId }

    private id = 0
    /** Returns a unique id each call that shouldn't have any conflict in the data model.
     * 
     * `requestSessionData()` needs to be called once before this can be used. */
    getUniqueId(): string {
        if(this._sessionId === null) throw new Error("You need to call `requestSessionData()` once before using `getUniqueId()`")
        return `TS${this._sessionId}_${(this.id++).toString(16)}`
    }

    // --- //

    // I tried adding some generics to the component requests,
    // but it seems to breaks overloading and always use the first one

    sendRequest(data: AddComponent): Promise<NewEntityId>
    sendRequest(data: UpdateComponent): Promise<SuccessResponse>
    sendRequest(data: GetComponent): Promise<ComponentData>
    sendRequest(data: RemoveComponent): Promise<SuccessResponse>

    sendRequest(data: AddSlot): Promise<NewEntityId>
    sendRequest(data: UpdateSlot): Promise<SuccessResponse>
    sendRequest(data: GetSlot): Promise<SlotData>
    sendRequest(data: RemoveSlot): Promise<SuccessResponse>

    sendRequest(data: DataModelOperationBatch): Promise<BatchResponse>

    /** `{ $type: "requestSessionData" }` doesn't have an overload because it confuses intellisense. 
     * Use `requestSessionData()` to get the proper response type. */
    sendRequest(data: Message): Promise<Response>
    sendRequest(data: Message){
        if(this.socket === null){
            throw new Error("You have to call `connect` before sending a request.")
        }
        if(this.readyState !== WebSocket.OPEN){
            throw new Error(`Socket(${this.socket.url}) is ${["CONNECTING", "OPEN but wasn't earlier", "CLOSING", "CLOSED"][this.socket.readyState]}.`)
        }

        const id = this.getMessageId()

        return new Promise<Response>((resolve, reject) => {
            const messageId = id.toString(16)
            this.awaitingPromises.set(messageId, [resolve, reject]);
            this.socket!.send(JSON.stringify({...data, messageId}))
        })
    }

    // --- //

    async requestSessionData(): Promise<SessionData> {
        const data = await this.sendRequest({$type: "requestSessionData"}) as SessionData
        this._sessionId = data.uniqueSessionId
        return data
    }

    /** This a wrapper for `sendRequest`. */
    addComponent<T extends Component = Component>(containerSlotId: string, data: MakeComponentPartialForAdd<T>): Promise<NewEntityId> {
        return this.sendRequest({$type: "addComponent", containerSlotId, data})
    }
    /** This a wrapper for `sendRequest`. */
    updateComponent<T extends Component = Component>(data: MakeComponentPartialForUpdate<T>): Promise<SuccessResponse> {
        return this.sendRequest({$type: "updateComponent", data})
    }
    /** This a wrapper for `sendRequest`. */
    getComponent<T extends Component = Component>(componentId: string): Promise<ComponentData<T>> {
        return this.sendRequest({$type: "getComponent", componentId}) as Promise<ComponentData<T>>
    }
    /** This a wrapper for `sendRequest`. */
    removeComponent(componentId: string): Promise<SuccessResponse> {
        return this.sendRequest({$type: "removeComponent", componentId})
    }

    /** This a wrapper for `sendRequest`. */
    addSlot(data: SlotPartial): Promise<NewEntityId> {
        return this.sendRequest({$type: "addSlot", data})
    }
    /** This a wrapper for `sendRequest`. */
    updateSlot(data: RequiredBy<SlotPartial, "id">): Promise<SuccessResponse> {
        return this.sendRequest({$type: "updateSlot", data})
    }
    /** This a wrapper for `sendRequest`. */
    getSlot(slotId: string, depth=0, includeComponentData=false): Promise<SlotData> {
        return this.sendRequest({$type: "getSlot", slotId, depth, includeComponentData})
    }
    /** This a wrapper for `sendRequest`. */
    removeSlot(slotId: string): Promise<SuccessResponse> {
        return this.sendRequest({$type: "removeSlot", slotId})
    }

    /** This is a wrapper for `sendRequest`.
     * 
     * If you want to uses the other `sendRequest` wrapper in a batch, use `batch()` instead. */
    dataModelOperationBatch(operations: DataModelOperation[]): Promise<BatchResponse>{
        return this.sendRequest({
            $type: "dataModelOperationBatch",
            operations
        })
    }

    // --- //

    /** This returns a factory for a batch message.
     * 
     * Don't forget to call `send()` at the end. 
     * 
     * Also each operation has its own success value, so you have to check it yourself. */
    batch(): BatchFactory {
        return new BatchFactory(this)
    }
}

class BatchFactory{
    operations: DataModelOperation[] = []
    link: ResoniteLinkClient

    constructor(link: ResoniteLinkClient){
        this.link = link
    }

    /** Each operation has its own success value.
     * This promise will only be rejected if the batch itself couldn't be processed. */
    send(): Promise<BatchResponse> {
        return this.link.dataModelOperationBatch(this.operations)
    }

    addOperation(data: DataModelOperation): this {
        this.operations.push(data)
        return this
    }

    /** This a wrapper for `addOperation`. */
    addComponent<T extends Component = Component>(containerSlotId: string, data: MakeComponentPartialForAdd<T>): this {
        return this.addOperation({$type: "addComponent", containerSlotId, data})
    }
    /** This a wrapper for `addOperation`. */
    updateComponent<T extends Component = Component>(data: MakeComponentPartialForUpdate<T>): this {
        return this.addOperation({$type: "updateComponent", data})
    }
    /** This a wrapper for `addOperation`. */
    getComponent(componentId: string): this {
        return this.addOperation({$type: "getComponent", componentId})
    }
    /** This a wrapper for `addOperation`. */
    removeComponent(componentId: string): this {
        return this.addOperation({$type: "removeComponent", componentId})
    }

    /** This a wrapper for `addOperation`. */
    addSlot(data: SlotPartial): this {
        return this.addOperation({$type: "addSlot", data})
    }
    /** This a wrapper for `addOperation`. */
    updateSlot(data: RequiredBy<SlotPartial, "id">): this {
        return this.addOperation({$type: "updateSlot", data})
    }
    /** This a wrapper for `addOperation`. */
    getSlot(slotId: string, depth=0, includeComponentData=false): this {
        return this.addOperation({$type: "getSlot", slotId, depth, includeComponentData})
    }
    /** This a wrapper for `addOperation`. */
    removeSlot(slotId: string): this {
        return this.addOperation({$type: "removeSlot", slotId})
    }
}