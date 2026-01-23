import { cyan, red } from "@std/fmt/colors";
import { ResoniteLinkClient, Component, Member, Response } from "../link/index.ts";

let input = (prompt("Connect to (localhost port or ws:// URL):") || "").trim()

let url: URL
try{
    url = new URL(input)
    if(url.protocol !== "ws:"){
        console.log("Scheme must be ws (websocket)")
        Deno.exit(0)
    }
} catch(_){
    const port = parseInt(input)
    if(port.toString() !== input){
        console.log("Failed to parse URL")
        Deno.exit(0)
    }
    url = new URL(`ws://localhost:${port}`)
}

const link = new ResoniteLinkClient()

link.addEventListener("close", () => {
    console.log(red("The socket has closed."))
    Deno.exit(0)
})

console.log("Connecting...")
await link.connect(url)
console.log("Connected.")

const sessionData = await link.requestSessionData()

console.log(`Resonite version: ${sessionData.resoniteVersion}`)
console.log(`ResoniteLink version: ${sessionData.resoniteLinkVersion}`)
console.log(`Session ID: ${sessionData.uniqueSessionId}`)

// --- //

let selectedSlot = (await link.sendRequest({
    $type: "getSlot",
    slotId: "Root",
    includeComponentData: false
})).data

let selectedComponent: Component | null = null as Component | null

async function goToRoot(){
    selectedComponent = null
    selectedSlot = (await link.sendRequest({
        $type: "getSlot",
        slotId: "Root",
        includeComponentData: false
    })).data
}

function refreshSlot(){
    return link.sendRequest({
        $type: "getSlot",
        slotId: selectedSlot.id,
        includeComponentData: false
    })
    .then(data => {
        selectedSlot = data.data
        return false
    })
    .catch(async (x: Response) => { 
        console.log(red(`Error! Failed to refresh selected slot: ${x.errorInfo}\nResetting back to root.`))
        await goToRoot()
        return true
    })
}

function refreshComponent(){
    return link.sendRequest({
        $type: "getComponent",
        componentId: selectedComponent!.id
    })
    .then(data => {
        selectedComponent = data.data
        return false
    })
    .catch((x: Response) => {
        console.log(red(`Error! Failed to refresh selected component: ${x.errorInfo}`))
        selectedComponent = null
        return true
    })
}

function displayMember(name: string, member: Member){
    if(member.$type === "reference"){
        console.log(`${name} (${member.id}): Target (${member.targetType}): ${member.targetId}`)
    } else if(member.$type === "list") {
        console.log(`${name} (${member.id}): <List (Count: ${member.elements.length})>`)
        for(const [i, element] of member.elements.entries()){
            displayMember(`[${i}]`, element)
        }
    } else if(member.$type === "syncObject"){
        console.log(`${name} (${member.id}): <Object>`)
        for(const [k,v] of Object.entries(member.members)){
            displayMember(k, v)
        }
    } else if(member.$type === "empty"){
        console.log(`${name} (${member.id}): <empty element>`)
    } else if(member.$type === "enum" || member.$type === "enum?"){
        console.log(`${name} (${member.id}): ${JSON.stringify(member.value)} (${member.enumType})`)
    } else {
        console.log(`${name} (${member.id}): ${JSON.stringify(member.value)}`)
    }
}

function displayComponentMembers(){
    if(selectedComponent){
        for(const [k,v] of Object.entries(selectedComponent.members)){
            displayMember(k, v)
        }
    }
}

function splitCommand(input: string){
    const command = input.split(" ", 1)[0]
    const argument = input.slice(command.length).trim()
    return [command, argument] as [string, string]
}

function commandPrompt(){
    let text = `Slot: ${selectedSlot.name.value} (ID: ${selectedSlot.id})`
    if(selectedComponent) text += ` Component: ${selectedComponent.componentType} (ID: ${selectedComponent.id})`
    text += ":"

    const inp = prompt(cyan(text)) || ""
    return inp.trim()
}

while((input = commandPrompt()) !== "exit"){
    const [command, argument] = splitCommand(input)

    try{
        outer:
        switch(command){
            case "echo": {
                console.log(argument)
            } break
    
            case "listchildren": {
                if(await refreshSlot()) break
    
                const children = selectedSlot.children || []
                console.log(`Children count: ${children.length}`)
                for(const [i, child] of children.entries()){
                    console.log(`\t[${i}] ${child.name.value} (ID: ${child.id})`)
                }
            } break
    
            case "listcomponents": {
                if(await refreshSlot()) break
    
                const components = selectedSlot.components || []
                console.log(`Component count: ${components.length}`)
                for(const [i, component] of components.entries()){
                    console.log(`\t[${i}] ${component.componentType} (ID: ${component.id})`)
                }
            } break
    
            case "selectchild": {
                if(await refreshSlot()) break
    
                const index = parseInt(argument)
                if(index.toString() !== argument){ console.log(red("Could not parse child index")); break }
    
                const children = selectedSlot.children || []
                if(index < 0 || index > children.length){ console.log(red("Child Index is out of range")); break }
    
                await link.sendRequest({
                    $type: "getSlot",
                    slotId: children[index].id,
                    includeComponentData: false
                }).then(data => {
                    selectedSlot = data.data
                    selectedComponent = null
                }).catch((x: Response) => {
                    console.log(red(`Error! ${x.errorInfo}`))
                })
            } break
    
            case "selectcomponent": {
                if(await refreshSlot()) break
    
                const index = parseInt(argument)
                if(index.toString() !== argument){ console.log(red("Could not parse component index")); break }
    
                const components = selectedSlot.components || []
                if(index < 0 || index > components.length){ console.log(red("Component Index is out of range")); break }
    
                await link.sendRequest({
                    $type: "getComponent",
                    componentId: components[index].id
                }).then(data => {
                    selectedComponent = data.data
                    displayComponentMembers()
                }).catch((x: Response) => {
                    console.log(red(`Error! ${x.errorInfo}`))
                })
            } break
    
            case "clearcomponent": {
                selectedComponent = null
            } break
    
            case "componentstate": {
                if(selectedComponent === null){
                    console.log(red("No component is selected"))
                } else {
                    if(await refreshComponent()) break
                    displayComponentMembers()
                }
            } break
    
            case "addcomponent": {
                if(argument === ""){ console.log(red("You must provide type of the component")); break }
                if(await refreshSlot()) break

                const componentId = link.getUniqueId()

                await link.sendRequest({
                    $type: "addComponent",
                    containerSlotId: selectedSlot.id,
                    data: {
                        componentType: argument,
                        id: componentId
                    }
                }).then(() => 
                    link.sendRequest({
                        $type: "getComponent",
                        componentId: componentId
                    }).then(data => {
                        selectedComponent = data.data
                        displayComponentMembers()
                    })
                ).catch((x: Response) => {
                    console.log(red(`Error! ${x.errorInfo}`))
                })
            } break
    
            case "addchild": {
                if(argument === ""){ console.log(red("You must provide a name of the child")); break }

                const childId = link.getUniqueId()
                
                await link.sendRequest({
                    $type: "addSlot",
                    data: {
                        id: childId,
                        parent: {targetId: selectedSlot.id},
                        name: {value: argument}
                    }
                }).then(() => 
                    link.sendRequest({
                        $type: "getSlot",
                        slotId: childId,
                        includeComponentData: false
                    }).then(data => {
                        selectedSlot = data.data
                        selectedComponent = null
                    })
                ).catch((x: Response) => {
                    console.log(red(`Error! ${x.errorInfo}`))
                })
            } break
    
            case "removeslot": {
                if(await refreshSlot()) break

                await link.sendRequest({
                    $type: "removeSlot",
                    slotId: selectedSlot.id
                }).then(() => 
                    link.sendRequest({
                        $type: "getSlot",
                        slotId: selectedSlot.parent.targetId!,
                        includeComponentData: false
                    }).then(x => {
                        selectedSlot = x.data
                        selectedComponent = null
                    }).catch(async (x: Response) => {
                        console.log(red(`Error! ${x.errorInfo}\n Resetting back to root.`))
                        await goToRoot()
                    })
                ).catch((x: Response) => {
                    console.log(red(`Error! ${x.errorInfo}`))
                })
            } break
    
            case "removecomponent": {
                let idToRemove: string

                if(argument === ""){
                    if(selectedComponent === null) {
                        console.log(red("No component is currently selected. Either select component first or provide index of component to remove."))
                        break
                    } else {
                        idToRemove = selectedComponent.id
                    }
                } else {
                    if(await refreshSlot()) break

                    const index = parseInt(argument)
                    if(index.toString() !== argument){ console.log(red("Could not parse component index")); break }
        
                    const components = selectedSlot.components || []
                    if(index < 0 || index > components.length){ console.log(red("Component Index is out of range")); break }

                    idToRemove = components[index].id
                }

                await link.sendRequest({
                    $type: "removeComponent",
                    componentId: idToRemove
                }).then(() => {
                    if(selectedComponent !== null && idToRemove === selectedComponent.id) selectedComponent = null
                }).catch((x: Response) => {
                    console.log(red(`Error! ${x.errorInfo}`))
                })
            } break
            
            case "selectparent": {
                if(selectedSlot.parent.targetId === null){
                    console.log(red("Root is topmost slot, cannot select parent"))
                } else {
                    if(await refreshSlot()) break

                    await link.sendRequest({
                        $type: "getSlot",
                        slotId: selectedSlot.parent.targetId,
                        includeComponentData: false
                    }).then(data => {
                        selectedSlot = data.data
                        selectedComponent = null
                    }).catch((x: Response) => {
                        console.log(red(`Error! ${x.errorInfo}`))
                    })
                }
            } break
    
            case "set": {
                if(selectedComponent === null){ console.log(red("No component is selected")); break }

                const [memberName, valueString] = splitCommand(argument)
                if(valueString === ""){ console.log(red("Invalid number of arguments. Usage: set <MemberName> <Value as JSON>")); break }

                // deno-lint-ignore no-explicit-any
                let value: any
                try { value = JSON.parse(valueString) }
                catch(_){ console.log(red(`Failed to parse value: ${valueString}`)); break }

                if(await refreshComponent()) break

                const member = selectedComponent.members[memberName]
                if(member === undefined){ console.log(red(`Member '${memberName}' doesn't exist`)); break }

                switch(member.$type){
                    case "empty":
                    case "list":
                    case "syncObject": {
                        console.log(red(`Setting members of type ${member.$type} is not supported`))
                    } break outer

                    case "reference": {
                        member.targetId = value
                    } break

                    default : {
                        member.value = value
                    } break
                }

                await new Promise<boolean>((res, rej) => {
                    link.sendRequest({
                        $type: "updateComponent",
                        data: {
                            id: selectedComponent!.id,
                            members: {
                                [memberName]: member
                            }
                        }
                    }).then(() => {
                        res(true)
                    }).catch((x: Response) => {
                        console.log(red(`Error! ${x.errorInfo}`))
                        res(false)
                    })

                    setTimeout(() => rej(), 500)
                }).then(async (noErr) => {
                    if(noErr && !(await refreshComponent())) displayComponentMembers()
                }).catch(() => {
                    console.log(red(`Error! Server didn't answer under 500ms. ${valueString} probably isn't the same type as ${memberName}.`))
                })
            } break
    
            case "importtexture": {
                console.log(red("No yet implemented."))
            } break
    
            default: {
                console.log(red(`Unknown command: ${command}`))
            } break
        }
    } catch(e){
        console.log(red("Error! "))
        console.log(e)
        break
    }
}

link.disconnect()
Deno.exit(0)