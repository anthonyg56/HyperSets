# HyperSets

HyperSets is an online platform I made for the HyperX community to store,
discover, and illuminate their pc's peripheral setup.

It offers many profiles to enhance their environment through a combination of
wide-ranging lighting effects, such as visual effects for ambient RGB lighting
and key binding for games or work. There are also 50+ games to choose from to
apply these effects.

## Live Demo

Publicly hosted at https://Hyper-Sets.com.

## Table of Content

- [Problem to solve](#Problemtosolve)
- [Motivation](#motivation)
- [Tech Stack](#techstack)
- [Features](#features)
- [Screenshots](#screenshots)
- [Lessons Learned](#lessonlearned)
- [License](#license)

## Problem to solve

- Alot of profiles on the web are scattered on multiple platforms. This makes it
  a hassel trying to find and download custom ones for users that want to
  explore alternatives outside of what the manufacture provides.

- There are talented people creating cool profiles, but dont have a platform to
  share it on. Unless they we're capable of building a website to host their
  presets; chances are it would get lost within the sea of content on a public
  form like reddit.

## Motivation

I theorized that if users had a platform to upload, share, and download custom
RGB profiles; along with an incentive of getting paid per download, then the
number of profiles availables would increase. This would mnake it easier to find
custom presets not only for my self, but the HyperX community as a whole.

I also at the time wanted to move away from non-relational databases and learn
SQL to improve my chances of hirability. So i figured this would be a great
opprotunity to do so.

## Tech Stack

**Programming Language:** TypeScript

**Client:** React, React Hook Form, React Drop Zone, Framer Motion, Next.Js,
Zod, lucide-react, TailwindCSS, clsx, AceternityUI, ShadcnUI

**Server:** Node, Supabase, PostgreSQL

## Features

- Light/dark mode toggle.
- Server side rendering.
- SEO
- Forgot password/password resets.
- Open Authentication (OAuth) for both sign up and login with providers Google,
  Discord, and Twitch.
- Email and password authentication.
- User sessions with HTTP only cookies containing refresh and access tokens.
- Multistep form that is accessible on every page but carefully possitioned to
  seamless fit within the ui.
- Toast notifications for specific events on client like an invalid login
  attempt, or successfull upload.
- Realtime notification system for when a member interacts with a preset (like,
  comment, download).
- Feedback system on all content related to presets via comments, likes, and
  ratings
- Profile page for members to share _all_ of their creations via url
- Cloud storage for uploading images
- Image optimization via Next.js <Image /> component
- Search display to find the exact preset you need
- Preset feed that can be filtered via hardware, game, and effects; as well as
  sorted by date uploaded, download amount, or views.
- Settings where a user can tweak the their profile info, security info, as well
  as presets.
- PostgreSQL RLS policies for added database security

## Screenshots

![App Screenshot](https://via.placeholder.com/468x300?text=App+Screenshot+Here)

## Lessons Learned

#### Entrepreneurial lesson

The biggest entrepreneurial takeaway that I got after launch was to **always
validate your idea and try to build an audience first**.

At launch i was completely lost as to how to get users because I had not told
anyone about it besides my friends and family. Despite providing good positive &
negative feedback, they were not the users i was making the app for and i soon
learned that i was blindlessly hoping that my users would love it. I knew the
target audience i was trying to reach and where to find them, but they knew
nothing about me or my product thus making it difficult to establish trust.

Another way i failed to validate the idea was by not doing a thorough enough
market research on competitors. A few days after launch, I reached out to the
user that inspired me to build HyperSets (he ran a personal page for corsair
profiles), and he informed me that there was a software out called SignalsRGB
doing what i was trying to do. Except far much better and they exapanded out to
all manufactures for both periphreals and rgb tower components (fans, ram stick,
etc).

validate the idea and build an audience do good market research launcing late

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
