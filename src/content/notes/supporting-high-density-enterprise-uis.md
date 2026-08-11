---
title: "Supporting High Density Enterprise UIs"
subtitle: "Users want to see data and don't care about your design system"
date: 2026-08-02
tags: ["design", "design systems", "enterprise", "density"]
---

## So you have a design system?
You have a design system - the corporate team carefully crafted it over a number of years. It's been refined, documented, and used in many of your products and applications. Its branded codename is well known to team members across different functions, and colleagues often refer to it by name. Your organization isn't exactly in the FAANG crowd, but at least you have a design system to work from, and there is some continuity across products. You're probably around a **3 – Functional** on the [Design System Maturity](https://www.nngroup.com/articles/design-system-maturity/) scale.

On the surface, it would appear you're mostly on the right track. Your products should all look consistent, right?

Probably yes. There are real benefits to having a centralized design system. Internally, it saves time when everyone works from the same patterns, components, colors, and interaction models. There will always be exceptions, and mature design systems typically provide governance and contribution models to handle them.

However, designers often have a distorted view of how much users value design system consistency.

## Users care about accomplishing their task
Users don't care whether your button came from a centralized component library or whether your spacing follows an 8-point grid. They care whether they can complete their work efficiently. If consistency helps them do that, it's valuable. If it gets in the way, consistency quickly becomes irrelevant.

This becomes especially apparent during large modernization efforts.

Imagine replacing a 20-year-old Windows desktop application with a modern web application. The legacy interface may look dated, but it was designed for users who spend eight hours a day inside the product. Tables were compact. Toolbars were dense. Dialogs prioritized information over aesthetics. Users became incredibly efficient with that environment.

Now imagine replacing it with a beautiful web application built entirely from a modern corporate design system.

Suddenly, every row is taller. Every form field has more padding. Cards replace tables. Comfortable spacing is applied everywhere because that's what the design system prescribes. The interface is undeniably cleaner, but users who previously saw 100 rows of data now see 50. They scroll more. They switch pages more often. They lose context. Simple comparison tasks become harder.

From the design team's perspective, the migration was a success. The application is modern, consistent, and aligned with the company standard.

From the user's perspective, it got slower.


This is where many design systems fall short. They optimize for consistency and maintainability but treat density as an implementation detail or ignore it entirely.

A customer-facing marketing site, an internal HR portal, and a laboratory information management system shouldn't necessarily have the same visual density simply because they share a design system. The appropriate level of density depends on the user's goals, the frequency of use, and the amount of information they need to process.

A design system that can't adapt to those differences forces product teams into an uncomfortable choice: violate the design system or ship a less effective experience.

That's why density shouldn't be viewed as a one-off customization. It should be treated as a first-class design decision—a capability built into the system itself. 

## Density as a theme axis 

The good news is that supporting density doesn’t require inventing an entirely new design system.

Most mature systems already understand the concept of themes. They have a light mode and a dark mode, each with a different set of semantic color tokens that ultimately resolve to different primitive values. The mechanism already exists.

Density can be treated much the same way.

Instead of switching color values, you’re switching spatial values:

* Spacing
* Component padding
* Control heights
* Font sizes (where appropriate)
* Icon sizes
* Table row heights
* Gaps between related elements

Conceptually, density becomes another orthogonal axis in your token architecture.

Rather than thinking of density as a collection of one-off component variants, think of it as another semantic context that resolves to different values. A button doesn’t need separate button-small, button-compact, and button-dense implementations. It simply consumes semantic spacing and sizing tokens, which resolve differently depending on the active density mode.

This approach scales remarkably well because components don’t need to know why a value changed—they simply consume the appropriate tokens.

### You Don’t Have to Retrofit Everything

One concern teams often have is that introducing density means rebuilding an existing design system from scratch.

It usually doesn’t.

Start by identifying the handful of tokens that have the biggest impact on information density:

* Base spacing scale
* Control heights
* Table row heights
* Form field padding
* Typography scale
* Icon sizing

These become your first “density-aware” semantic tokens.

Initially, most of your system can continue using today’s values, while data-heavy components opt into the new density tokens. Over time, more components migrate as they’re updated, without forcing a disruptive redesign across every product.

For many enterprise applications, this incremental approach is enough to support both comfortable and compact experiences with surprisingly little additional complexity.



