# ResoniteLinkTS

**ResoniteLinkTS** is mostly a collection of TS types to describe [ResoniteLink](https://github.com/Yellow-Dog-Man/ResoniteLink) requests and responses.

It includes a lightweight client to provide the correct types and match requests to their response using promises.

> [!CAUTION]
> Asset importing is not yet implemented.

## Installation

```bash
deno add jsr:@coin/resonitelink-ts  # Deno
npx jsr add @coin/resonitelink-ts   # npm
pnpm i jsr:@coin/resonitelink-ts    # pnpm
yarn add jsr:@coin/resonitelink-ts  # Yarn
bunx jsr add @coin/resonitelink-ts  # Bun
```

## Usage

```ts
import { ResoniteLinkClient, Component, Field, PrimitiveType, NullableType } from "@coin/resonitelink-ts"

const link = new ResoniteLinkClient()

await link.connect("ws://localhost:PORT")

await link.requestSessionData()

// Create Slot
const slotId = link.getUniqueId()
await link.addSlot({
    id: slotId,
    name: {value: `Hello from TS!`},
    position: {value: {x: 1, y: 2, z: 3}}
})

// Declare Component Type
type ValueField<T extends PrimitiveType | NullableType> = Component<
    `[FrooxEngine]FrooxEngine.ValueField<${T}>`, 
    {
        Value: Field<T>
    }
>

// Add Component
await link.addComponent<ValueField<"int">>(slotId, {
    componentType: "[FrooxEngine]FrooxEngine.ValueField<int>",
    members: {
        Value: {$type: "int", value: 42},
        Enabled: {$type: "bool", value: false}
    }
})

// Get Slot
const response = await link.getSlot(slotId)
console.log(response.data)

link.disconnect()
```

For more examples, look at [/example](./example/) or [/repl](./repl/) (a TS port of the ResoniteLink REPL).