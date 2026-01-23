import type { RequiredBy } from "./types.ts";
import type { Component, GetSlot, SlotData, Message, Response, SessionData, GetComponent, ComponentData, AddSlot, SuccessResponse, UpdateSlot, RemoveSlot, AddComponent, UpdateComponent, RemoveComponent } from "./models/index.ts";
import type { MakeComponentPartialForAdd, MakeComponentPartialForUpdate, SlotPartial } from "./index.ts";

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
    connect(url: string | URL){
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

    get readyState(){
        if(this.socket) return this.socket.readyState
        return WebSocket.CLOSED
    }

    // --- //

    private messageId = 0
    private getMessageId(){ return this.messageId++ } // Unique message id

    private _sessionId: string | null = null
    get sessionId(){ return this._sessionId }

    private id = 0
    /** Returns a unique id each call that shouldn't have any conflict in the data model.
     * 
     * `requestSessionData()` needs to be called once before this can be used. */
    getUniqueId(){
        if(this._sessionId === null) throw new Error("You need to call `requestSessionData()` once before using `getUniqueId()`")
        return `TS${this._sessionId}_${(this.id++).toString(16)}`
    }

    // --- //

    // I tried adding some generics to the component requests,
    // but it seems to breaks overloading and always use the first one

    sendRequest(data: AddComponent): Promise<SuccessResponse>
    sendRequest(data: UpdateComponent): Promise<SuccessResponse>
    sendRequest(data: GetComponent): Promise<ComponentData>
    sendRequest(data: RemoveComponent): Promise<SuccessResponse>

    sendRequest(data: AddSlot): Promise<SuccessResponse>
    sendRequest(data: UpdateSlot): Promise<SuccessResponse>
    sendRequest(data: GetSlot): Promise<SlotData>
    sendRequest(data: RemoveSlot): Promise<SuccessResponse>

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

    requestSessionData(){
        return (this.sendRequest({
            $type: "requestSessionData"
        }) as Promise<SessionData>)
        .then(data => {
            this._sessionId = data.uniqueSessionId
            return data
        })
    }

    /** This a wrapper for `sendRequest`. */
    addComponent<T extends Component = Component>(containerSlotId: string, data: MakeComponentPartialForAdd<T>){
        return this.sendRequest({$type: "addComponent", containerSlotId, data})
    }
    /** This a wrapper for `sendRequest`. */
    updateComponent<T extends Component = Component>(data: MakeComponentPartialForUpdate<T>){
        return this.sendRequest({$type: "updateComponent", data})
    }
    /** This a wrapper for `sendRequest`. */
    getComponent<T extends Component = Component>(componentId: string){
        return this.sendRequest({$type: "getComponent", componentId}) as Promise<ComponentData<T>>
    }
    /** This a wrapper for `sendRequest`. */
    removeComponent(componentId: string){
        return this.sendRequest({$type: "removeComponent", componentId})
    }

    /** This a wrapper for `sendRequest`. */
    addSlot(data: SlotPartial){
        return this.sendRequest({$type: "addSlot", data})
    }
    /** This a wrapper for `sendRequest`. */
    updateSlot(data: RequiredBy<SlotPartial, "id">){
        return this.sendRequest({$type: "updateSlot", data})
    }
    /** This a wrapper for `sendRequest`. */
    getSlot(slotId: string, depth=0, includeComponentData=false){
        return this.sendRequest({$type: "getSlot", slotId, depth, includeComponentData})
    }
    /** This a wrapper for `sendRequest`. */
    removeSlot(slotId: string){
        return this.sendRequest({$type: "removeSlot", slotId})
    }
}