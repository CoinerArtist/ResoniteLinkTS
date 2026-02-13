import { ResoniteLinkClient, FieldDefinition, ListDefinition, SyncObjectMemberDefinition } from "../../link/index.ts"

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

// deno-lint-ignore no-explicit-any
function log(data: any){
    console.log(Deno.inspect(data, {colors: true, depth: 10}))
}

const component = await link.getComponentDefinition("[FrooxEngine]FrooxEngine.PBS_Metallic", true)
log(component)

console.log("------------------1-")

const componentList = await link.getComponentTypeList(component.definition.categoryPath) // "Assets/Materials"
log(componentList)

console.log("------------------2-")

const enumDef = await link.getEnumDefinition((component.definition.members.BlendMode as FieldDefinition).valueType.type) // "[FrooxEngine]FrooxEngine.BlendMode"
log(enumDef)                                 // For an actual use case, you would narrow the type by comparing "$type"

console.log("------------------3-")

const genericType = await link.getGenericTypeDefinition("[FrooxEngine]FrooxEngine.ValueGradientDriver<float3>")
log(genericType)

console.log("------------------4-")

const component2 = await link.getComponentDefinition(genericType.definition.fullTypeName, false) // "[FrooxEngine]FrooxEngine.ValueGradientDriver<>"
log(component2)

console.log("------------------5-")

const syncObjectDef = await link.getSyncObjectDefinition(((component2.definition.members.Points as ListDefinition).elementDefinition as SyncObjectMemberDefinition).type.type) // "[FrooxEngine]FrooxEngine.ValueGradientDriver<>+Point"
log(syncObjectDef)

console.log("------------------6-")

const simpleType = await link.getTypeDefinition("float3")
log(simpleType)

link.disconnect()