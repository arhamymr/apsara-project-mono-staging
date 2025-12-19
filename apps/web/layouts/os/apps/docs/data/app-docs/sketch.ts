/**
 * Documentation for the Sketch App
 * 
 * Requirements: 1.3, 3.1
 */

import type { AppDocumentation } from '../../types';

export const sketchDocs: AppDocumentation = {
  id: 'sketch',
  name: 'Sketch',
  icon: '✏️',
  description: 'A drawing and sketching application with various tools and shapes.',
  categories: [
    {
      id: 'overview',
      name: 'Overview',
      order: 1,
      entries: [
        {
          id: 'introduction',
          title: 'Introduction to Sketch',
          slug: 'introduction',
          content: `Sketch is a versatile drawing application that lets you create diagrams, illustrations, and freehand drawings.

## Key Features

- **Drawing Tools**: Pen, line, shapes, and more
- **Shape Tools**: Rectangle, circle, and arrow tools
- **Text Tool**: Add text annotations
- **Eraser**: Remove unwanted elements
- **Save & Load**: Save your sketches and load them later

## Interface Overview

The Sketch app consists of:

1. **Toolbar**: Drawing tools and options
2. **Canvas**: Your drawing area
3. **Header**: Title, save, and sketch management

## Getting Started

Click the ✏️ icon in your dock to open Sketch. Select a tool and start drawing on the canvas.
`,
        },
      ],
    },
    {
      id: 'getting-started',
      name: 'Getting Started',
      order: 2,
      entries: [
        {
          id: 'drawing-tools',
          title: 'Drawing Tools',
          slug: 'drawing-tools',
          content: `Learn about the different tools available in Sketch.

## Available Tools

### Pen Tool
Freehand drawing for sketches and signatures.
- Click and drag to draw
- Release to finish the stroke

### Line Tool
Draw straight lines between two points.
- Click to start
- Drag to the end point
- Release to complete

### Rectangle Tool
Create rectangular shapes.
- Click to set the starting corner
- Drag to define the size
- Release to complete

### Circle Tool
Draw circles and ellipses.
- Click to set the center
- Drag to define the radius
- Release to complete

### Arrow Tool
Create arrows for annotations.
- Click to start
- Drag to the arrow head
- Release to complete

### Text Tool
Add text to your sketch.
- Click where you want text
- Type your text
- Click elsewhere to finish

### Eraser Tool
Remove elements from your sketch.
- Select the eraser
- Click on elements to remove them

## Tool Options

Most tools support:
- **Color**: Choose your drawing color
- **Line Width**: Adjust stroke thickness
`,
        },
        {
          id: 'saving-sketches',
          title: 'Saving Sketches',
          slug: 'saving-sketches',
          content: `Learn how to save and manage your sketches.

## Saving Your Work

1. Enter a title in the title field
2. Click **Save** or the save button
3. Your sketch is saved with a thumbnail preview

## Creating a New Sketch

1. Click the **New** button
2. A blank canvas appears
3. Start drawing your new sketch

## Loading Saved Sketches

1. Click **My Sketches** to see your saved work
2. Click on a sketch thumbnail to load it
3. Continue editing where you left off

## Deleting Sketches

1. Open **My Sketches**
2. Click the **Delete** button on a sketch
3. Confirm the deletion

## Auto-Save

Your sketches are saved when you click save. Remember to save your work regularly to avoid losing changes.

## Sketch Thumbnails

Each saved sketch shows:
- A preview thumbnail
- The sketch title
- Last saved time
`,
        },
      ],
    },
    {
      id: 'features',
      name: 'Features',
      order: 3,
      entries: [
        {
          id: 'tips-tricks',
          title: 'Tips and Tricks',
          slug: 'tips-tricks',
          content: `Get the most out of Sketch with these tips.

## Drawing Tips

### Straight Lines
Use the Line tool for perfectly straight lines instead of trying to draw them freehand.

### Consistent Shapes
Use the Rectangle and Circle tools for uniform shapes.

### Annotations
Combine arrows and text to create clear annotations.

## Workflow Tips

### Plan Your Sketch
- Start with basic shapes
- Add details progressively
- Use text for labels

### Organize Elements
- Group related elements together
- Use consistent colors for related items
- Leave space for annotations

## Use Cases

### Diagrams
\`\`\`
[Box A] ---> [Box B] ---> [Box C]
\`\`\`

### Flowcharts
Create process flows with shapes and arrows.

### Wireframes
Sketch out UI designs quickly.

### Mind Maps
Visualize ideas and connections.

## Best Practices

- Save frequently
- Use descriptive titles
- Keep sketches focused on one topic
- Use colors meaningfully
`,
        },
      ],
    },
  ],
};
