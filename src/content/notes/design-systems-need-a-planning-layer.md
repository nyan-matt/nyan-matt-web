---
title: "Design Systems Need a Planning Layer"
subtitle: "Patterns as a planning primitive"
date: 2026-08-03
featured: true
tags: ["design", "design systems", "ai", "ai process"]
---

One of the first things teams do when adopting AI for UI generation is give the model access to their design system.

They feed it Storybook. Component documentation. Figma libraries. Usage guidelines. Maybe even examples from production.

And it works... up to a point.

The AI learns that a `Button` has a primary and secondary variant. It knows when to use a `Dialog` instead of a `Popover`. It can assemble forms, tables, cards, and navigation with reasonable accuracy.

But eventually the quality plateaus. Not because the model isn't capable, but because we've given it the wrong building blocks.

## Components aren't how we design

When experienced product designers approach a new feature, they don't think in components. Nobody starts with:

> "This screen needs two buttons, three inputs, and a data table."

Instead, they think in patterns.

> "This is a master-detail workflow."

> "This is a review-and-approve experience."

> "This needs progressive disclosure."

> "This is essentially a dashboard."

The pattern comes first. The components follow naturally.

Design systems, however, rarely encode this knowledge. They document *what* components exist, but not *how they work together* to solve recurring product problems.

## AI is surprisingly good at planning

One thing I've observed while experimenting with LLMs is that they're often better planners than implementers.

Give an agent a product requirement like:

> Users need to browse thousands of records, filter them, inspect details, and perform bulk actions.

Most modern models won't propose a carousel or a Kanban board. They'll typically converge on something resembling a master-detail layout with a searchable table, filtering, bulk actions, and an inspector panel.

That's a good decision.

Where things start to break down is execution. How wide should the inspector be? Should filters appear inline or in a drawer? Which table variant is appropriate? What interactions are required? What must remain consistent with every other application?

At this point, the model starts filling in gaps from general training instead of from the product system it is supposed to be using.

## Patterns are planning primitives

This is where I think design systems have room to evolve.

Components shouldn't be the highest level of abstraction. Patterns should.

Imagine a design system that didn't just document a **Data Table**, but also documented a **Master-Detail** pattern. Not as a screenshot, but as a structured artifact.

A pattern could define:

- The problem it solves.
- When it should be used.
- Required regions.
- Optional regions.
- Which components belong in each region.
- What is adaptable.
- What must remain fixed.
- Accessibility and interaction requirements.
- Common variations.

Now the planning process becomes constrained instead of generative. The AI is no longer inventing a layout from scratch. It's selecting an existing pattern and adapting it to the requirements.

## Separating planning from execution

I think this is the direction AI-assisted product development is heading: instead of asking an LLM to generate an interface directly, ask it to generate a plan. That plan might look something like this:

```yaml
pattern: master-detail

regions:
  toolbar:
    - search
    - filters
    - bulk actions

content:
  component: data-table

detail:
  component: inspector

constraints:
  density: compact
  selection: multiple
  pagination: required
```

Notice what's missing: no HTML, no React, no CSS, no Figma. Just intent.

Once that plan exists, a deterministic system can assemble the interface using canonical components, validated layouts, and known constraints. The LLM doesn't need to remember every spacing rule or every accessibility requirement because those decisions have already been encoded into the system.

## Design Systems as Knowledge Systems

For years we've thought of design systems primarily as component libraries. Then we expanded them into token systems. I think the next evolution is something different.

Design systems become repositories of product knowledge. Components remain the execution primitives, patterns become the planning primitives, and tokens provide the implementation values. AI doesn't replace any of those layers. It connects them.

The interesting challenge isn't teaching AI how to draw another button. It's teaching our design systems how to describe the product decisions that happen before the first button is ever placed.
