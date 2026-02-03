import { ResoniteLinkClient } from "../link/index.ts"
import { BoxCollider, BoxMesh, Grabbable, MeshRenderer, PBS_Metallic, TextRenderer, ValueCopy } from "./types.ts";

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

await link.requestSessionData() // Needed to use getUniqueId()

const boxSlotId = link.getUniqueId()

const pos = {
    x: Math.random()*2-1, 
    y: Math.random()*2+1, 
    z: Math.random()*2-1
}

const angle = Math.random()*Math.PI*2
const rot = {
    x: 0,
    y: Math.sin(angle),
    z: 0,
    w: Math.cos(angle)
}

const size = 1 + Math.random()*1
const scale = {
    x: size,
    y: size,
    z: size
}

await link.addSlot({
    id: boxSlotId,
    name: {value: `Hello from TS!`},
    position: {value: pos},
    rotation: {value: rot},
    scale: {value: scale}
})

const boxMeshId = link.getUniqueId()
const boxSizeId = link.getUniqueId()

await link.addComponent<BoxMesh>(boxSlotId, {
    componentType: "[FrooxEngine]FrooxEngine.BoxMesh",  // Since the component type is given, you can autocomplete this value. (CTRL+Space on VSCode to force it to appear)
    id: boxMeshId,                                      // This is useful for all the type strings that have to be included.
    members: {
        Size: {$type: "float3", value: {x: 0.5, y: 0.5, z: 0.5}, id: boxSizeId}
    }
})

const materialId = link.getUniqueId()

await link.addComponent<PBS_Metallic>(boxSlotId, {
    componentType: "[FrooxEngine]FrooxEngine.PBS_Metallic",
    id: materialId,
    members: {
        AlbedoColor: {$type: "colorX", value: {r: 0.19, g: 0.47, b: 0.78, a: 1, profile: "sRGB"}},
        OffsetFactor: {$type: "float", value: 2},
        OffsetUnits: {$type: "float", value: 10}
    }
})

const rendererId = link.getUniqueId()

await link.addComponent<MeshRenderer>(boxSlotId, {
    componentType: "[FrooxEngine]FrooxEngine.MeshRenderer",
    id: rendererId,
    members: {
        Mesh: {$type: "reference", targetId: boxMeshId},
        Materials: {
            $type: "list",
            elements: [{$type: "reference", targetId: materialId}]  // Lists are currently bugged, so this will be null
        }
    }
})

// This is currently needed to correctly set the material
const meshRenderer = (await link.getComponent<MeshRenderer>(rendererId)).data
await link.updateComponent<MeshRenderer>({
    id: rendererId,
    members: {
        Materials: {
            $type: "list", 
            elements: [{$type: "reference", targetId: materialId, id: meshRenderer.members.Materials.elements[0].id}]
        }
    }
})

const colliderSizeId = link.getUniqueId()

await link.addComponent<BoxCollider>(boxSlotId, {
    componentType: "[FrooxEngine]FrooxEngine.BoxCollider",
    members: {
        Size: {$type: "float3", value: {x: 0, y: 0, z: 0}, id: colliderSizeId}
    }
})

await link.addComponent<ValueCopy<"float3">>(boxSlotId, {
    componentType: "[FrooxEngine]FrooxEngine.ValueCopy<float3>",
    members: {
        Source: {$type: "reference", targetId: boxSizeId},
        Target: {$type: "reference", targetId: colliderSizeId},
        WriteBack: {$type: "bool", value: true}
    }
})

await link.addComponent<Grabbable>(boxSlotId, {
    componentType: "[FrooxEngine]FrooxEngine.Grabbable",
    members: {
        Scalable: {$type: "bool", value: true}
    }
})

const textSlotId = link.getUniqueId()

await link.addSlot({
    id: textSlotId,
    name: {value: "Text"},
    parent: {targetId: boxSlotId},
    position: {value: {x: 0.22, y: -0.22, z: -0.25}}
})

await link.addComponent<TextRenderer>(textSlotId, {
    componentType: "[FrooxEngine]FrooxEngine.TextRenderer",
    members: {
        Text: {$type: "string", value: "TS"},
        Size: {$type: "float", value: 2.5},
        HorizontalAlign: {$type: "enum", value: "Right"},
        VerticalAlign: {$type: "enum", value: "Bottom"}
    }
})

link.disconnect()