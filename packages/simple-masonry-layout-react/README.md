# SimpleMasonryLayoutReact

## Install

`npm i @jchn/simple-masonry-layout-react`

## Example

```tsx
import React from "react"
import Layout from "@jchn/simple-masonry-layout-react"

const MasonryGrid = () => {
  const items = [
    { size: { width: 150, height: 200 }, data: null },
    { size: { width: 200, height: 150 }: data: null },
  ];

  return (
    <Layout
      items={items}
      columns={3}
      options={{ gutter: 5 }}
      renderContent={({ rect, data }) => (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            transform: `translate(${rect.x}px, ${rect.y}px)`,
            height: "auto",
          }}
        >
          {/* render your content */}
        </div>
      )}
    />
  )
}
```
