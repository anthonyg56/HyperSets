
# HyperSets

![HyperSets Homepage - Light Mode](./assets/images/home_light.gif)
*HyperSets Homepage - Light Mode*
  
An online platform for the HyperX community to store, discover, and illuminate their pc's peripheral setup.

HyperSets offers a wide array of custom profiles for members to enhance their environment through a combination of visual effects for ambient RGB lighting and key binding macros for games or work. Along with a library of 50+ games to choose from that aligns with its aesthetics.


## Live Demo

Publicly being hosted at https://Hyper-Sets.com. 


## Table of Content
- [HyperSets](#hypersets)
  - [Live Demo](#live-demo)
  - [Table of Content](#table-of-content)
  - [Problem to solve](#problem-to-solve)
  - [Motivation](#motivation)
  - [Tech Stack](#tech-stack)
  - [Features](#features)
  - [Screenshots](#screenshots)
  - [Lessons Learned](#lessons-learned)
      - [Entrepreneurial lessons:](#entrepreneurial-lessons)
      - [Web Development lessons](#web-development-lessons)
  - [License](#license)
## Problem to solve

There are talented people creating cool profiles, but dont have a platform to share it on. Unless they are capable of building a website to host their presets; chances are it would get uploaded on a public form like reddit and lost within the sea of content. Thus making it a hassel to explore alternatives outside of what the manufacture provides since alot of custom profiles are scattered on the web.

## Motivation

I theorized that if users had a platform to upload, share, and download custom RGB profiles; along with an incentive of getting paid per download, then the number of profiles availables would increase. This would make it easier to find custom presets not only for my self, but the HyperX community as a whole. 

I also at the time wanted to move away from non-relational databases and learn SQL to. So i figured this would be a great opprotunity to do so.

## Tech Stack

**UI\UX Design Tool:** Figma

**Programming Language:** TypeScript

**Client:** React, React Hook Form, React Drop Zone, Framer Motion, Next.Js, Zod, lucide-react, TailwindCSS, clsx, AceternityUI, ShadcnUI

**Server:** Node, Supabase, PostgreSQL

**Project Management:** Trello

**Devops:** Vercel

## Features

- Light/dark mode toggle.
- Server side rendering.
- SEO
- Scehma Validation for form submissions
- Forgot password/password resets.
- Open Authentication (OAuth) for both sign up and login with providers Google, Discord, and Twitch.
- Email and password authentication.
- User sessions with HTTP only cookies containing refresh and access tokens.
- Multistep form that is accessible on every page but carefully possitioned to seamless fit within the ui.
- Toast notifications for specific events on client like an invalid login attempt, or successfull upload.
- Realtime notification system for when a member interacts with a preset (like, comment, download).
- Feedback system on all content related to presets via comments, likes, and ratings
- Profile page for members to share *all* of their creations via url
- Cloud storage for uploading images
- Image optimization via Next.js <Image /> component
- Search display to find the exact preset you need
- Preset feed that can be filtered via hardware, game, and effects; as well as sorted by date uploaded, download amount, or views.
- Settings where a user can tweak the their profile info, security info, as well as presets.
- PostgreSQL RLS policies for added database security

## Screenshots

![Presets Page](./assets/images/presets_page.png)
*Feed of presets on path /presets*/

![App Screenshot](./assets/images/profile_page.png)
*A members profile page and all their presets created*

![App Screenshot](./assets/images/empty_comments.png)
*Comment sheet for an invidual preset*

![App Screenshot](./assets/images/Screenshot%202024-05-14%20044735.png)
*Security settings where members can update their password and other authentication settings*

![App Screenshot](./assets/images/Screenshot%202024-05-11%20143416.png)
*Form for creating and uploading a new preset, but in a modal*

![App Screenshot](./assets/images/Screenshot%202024-05-14%20043706.png)
*Login page for users to sign in via OAuth providers Discord, Twitch, and Google, or just email and password*

## Lessons Learned

Out of all my projects, I'm most proud of this one and its helped me grow as a developer the most. There's alot to take away from the journey of building HyperSets to the point I would need to write 2 blog posts to cover everything. For the time being, i'll try to highlight some key points I learned and believe is could help others to know.

#### Entrepreneurial lessons:

The biggest entrepreneurial takeaway that I got after launch covers how I could have done better to validate the idea and why its important to **properly**: 

- **Build an audience before launch** - It very quickly became apparent that blindlessly expecting an audience to love any product, with out solid proof its 100% what they want, is a bad idea. At launch time, I was completely lost on how to get users because no one knew about it outside of my inner circle. When it came time to sharing, people did not like it as much as I'd hope.

- **Do *extensive* market research** - I naievely was under the the impression that HyperSets was first to market with the idea and paid the price. After reaching out to someone that had done something similar on reddit, they informed me about an application called SignalsRGB that is doing almost exactly what HyperSets is aiming for. Except theres already an audience for their platform, software build for desktop that syncs led's effects with both pc periphreals and tower components, as well as an inhouse marketplace to download custom profiles. 

- **Build an MVP** - This one might be confusing considering the MVP is fully functional. What I mean is that the points above could have been addressed much earlier, with alot of time saved, if HyperSets had not launched with so many features. Looking back, I would have only picked **3 out of the 19 features listed**; an 85% cut! Which is the **true** meaning of an MVP. The only features needed to still solve the primary problem, providing a centralized location for custom presets to download; were SEO for search indexing, server side rendering to enable SEO, and a central feed of presets for download. 

#### Web Development lessons

For context, all points are presented from the perspective of a solo/hobbiest web developer and I apologize ahead of time if I misconstrue any topics due to insufficent industry knowledge.

- **No designer? Use a UI/Component library** - I typically prefer to draw a mockup in Figma and then write the code for personal projects because most ui libraries are not appealing to me nor accissible enough to change. [ShadCN/UI](https://ui.shadcn.com/), voted the [hottest project of the year](https://risingstars.js.org/2023/en) on github, has completely changed my perspective on these tools. The pages and layout that I made on the fly (without wireframing) with Shadcn/ui were more robust and aestically pleasing compared to what i made in Figma. It also took about 10% of the time and effort to make without sacrificing any controll or ownership over the components.

- **Relational databases are better for most situations** - That is, unless your projects data requirements are very clear and the benefits of a non-relational database is absolutely needed. Otherwise, relational databases are, more often than not, the better choice due to ACID properties that help maintain data integrity and transactional reliability. This makes querying data more predictable no matter the service, and is why, unless I absolutely need a non-relational database, will be sticking with PostgresSQL over MongoDB moving forward for my personal projects.

- **A Javascript framework isnt always needed** - There are a ton of frameworks made with Javascript that have revolutionized the way we build user interfaces and use the web today. While some devs claim that if you’re not using tools like react, next.js, or svelte then you’re falling behind; others will argue that these tools have introduced a ton of unnecessary complexity into the web development ecosystem, and i agree. But just like everything else we use, whether or not to use a framework depends on the situation at hand. I believe devs should use the tools they are best with, if time is of the essence, over adopting a new language or framework. After PMF (product market fit) is established, or if the situation calls for it, then move onto the technology that is best overall. For HyperSets, I did not need to use React or Next.Js, these are just my default go to's cause it's what I work the fastest in.

- **The limitations of JavaScript\TypeScript** - I have been working with JavaScript\Typescript on and off for atleast 5 years now and due to the nature of how i learned (outside of a traditional 9 -5 or school setting), there were some gaps in my knowledge i did not even know i had. The catalyst for me that has helped close that gap, as well as lead to the biggest pardigm shift in regards to personal understanding of computer science fundementals, was one sentance: "JavaScript is a Scripting language". To some this is obvious, but for me it completely challenged the way i viewed the language, and programming as a whole. It's embarrsising to say but before hand, i saw JavasScript as a *general use* programming language (i know, i know) since it's everywhere but i couldn't have been more wrong. I now know that its a scripting language meant to be interpreted in the browser or a node.js runtime enviorment. This is an important to note because knowing a languages limitations helps you understand its scope of use better. This relization sent me down a rabbit hole that improved my deph of understanding of key programming fundementals like pointers & references, memmory manipulation, how the size of a value is determined in bytes and bits, and many more. As well as adopting my first compiled language: [Golang](https://go.dev/).
  
## License

MIT License

Copyright (c) 2024 HyperSets

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

