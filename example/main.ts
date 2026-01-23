import { ResoniteLinkClient } from "../link/index.ts"
import { BoxCollider, BoxMesh, Grabbable, MeshRenderer, PBS_Metallic, ValueCopy } from "./types.ts";

// --- //

const input = (prompt("Connect to (localhost port or ws:// URL):") || "").trim()

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

console.log("Connecting...")
await link.connect(url)
console.log("Connected.")

// --- //

const { uniqueSessionId } = (await link.requestSessionData()) // Needed to use getUniqueId()

const slotId = link.getUniqueId()

await link.addSlot({
    id: slotId,
    name: {value: `Hello from TS${uniqueSessionId}!`},
    position: {value: {x: Math.random()*2-1, y: Math.random()*2+1, z: Math.random()*2-1}}
})

const boxMeshId = link.getUniqueId()
const boxSizeId = link.getUniqueId()

await link.addComponent<BoxMesh>(slotId, {
    componentType: "[FrooxEngine]FrooxEngine.BoxMesh",  // Since the component type is given, you can autocomplete this value. (CTRL+Space on VSCode to force it to appear)
    id: boxMeshId,                                      // This is useful for all the type strings that have to be included.
    members: {
        Size: {$type: "float3", value: {x: 0.5, y: 0.5, z: 0.5}, id: boxSizeId}
    }
})

const materialId = link.getUniqueId()

await link.addComponent<PBS_Metallic>(slotId, {
    componentType: "[FrooxEngine]FrooxEngine.PBS_Metallic",
    id: materialId,
    members: {
        AlbedoColor: {$type: "colorX", value: {r: 0.19, g: 0.47, b: 0.78, a: 1, profile: "sRGB"}}
    }
})

await link.addComponent<MeshRenderer>(slotId, {
    componentType: "[FrooxEngine]FrooxEngine.MeshRenderer",
    members: {
        Mesh: {$type: "reference", targetId: boxMeshId},
        Materials: {
            $type: "list",
            elements: [{$type: "reference", targetId: materialId}]  // Lists are currently bugged, so this will be null
        }
    }
})

const colliderSizeId = link.getUniqueId()

await link.addComponent<BoxCollider>(slotId, {
    componentType: "[FrooxEngine]FrooxEngine.BoxCollider",
    members: {
        Size: {$type: "float3", value: {x: 0, y: 0, z: 0}, id: colliderSizeId}
    }
})

await link.addComponent<ValueCopy<"float3">>(slotId, {
    componentType: "[FrooxEngine]FrooxEngine.ValueCopy<float3>",
    members: {
        Source: {$type: "reference", targetId: boxSizeId},
        Target: {$type: "reference", targetId: colliderSizeId},
        WriteBack: {$type: "bool", value: true}
    }
})

await link.addComponent<Grabbable>(slotId, {
    componentType: "[FrooxEngine]FrooxEngine.Grabbable",
    members: {
        Scalable: {$type: "bool", value: true}
    }
})

link.disconnect()