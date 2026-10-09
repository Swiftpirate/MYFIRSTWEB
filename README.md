# Yande Sichula — Personal Website

My personal website for **ICT251 Web Technologies, Activity 3** (Mulungushi University, School of
Engineering and Technology). I am a Data Science student, and this site is an improved version of my
Activity 2 page. It keeps my About Me, hobbies, learning plan, photos, video and audio, and adds a
Projects & Skills section, a responsive frontier-themed design and four JavaScript features.

- **Live site (Render):** https://myfirstweb-lq9a.onrender.com
- **Source code:** https://github.com/Swiftpirate/MYFIRSTWEB

Built with plain **HTML5, CSS and JavaScript**. There are no frameworks and no build step.

## JavaScript features and how to test them

All the feature code is in [`js/script.js`](js/script.js).

| # | Feature | How to test it |
|---|---------|----------------|
| 1 | **Contact form validation and preview** (compulsory) | Go to **Contact**. (a) Press *Validate & Preview* with every field empty: an error appears under Name, Email and Message, and the cursor moves to the first problem. (b) Type only spaces in Name and Message: they are still rejected. (c) Enter `abc`, `a@b` or `name@example.c` as the email: "Please enter a valid email address". (d) Fill in a name, a valid email and a message of at least 10 characters: a **"Validated — not sent"** preview appears under the form, without reloading the page. Nothing is sent or saved. *Clear Form* removes the errors and the preview. |
| 2 | **Expandable project details** | In **Projects & Skills**, press *Show details* on any card. The details open, the arrow turns down, the button fills in and changes to *Hide details*. Press it again to close. Each card opens and closes on its own. |
| 3 | **Photo gallery viewer** | In **My Photos**, press *Next* and *Previous*. The photo, its caption and the "Photo 1 of 3" counter change together. *Previous* is disabled on the first photo and *Next* on the last, so the viewer never goes past either end. The left and right arrow keys also work when a viewer button has focus. |
| 4 | **Study hours calculator** | In **My Learning Plan**, enter hours per day and days per week, then press *Calculate*, e.g. `1.5` and `3` gives **4.5 hours per week**. Rejected with a message: blank fields, non-numbers (`abc`, `1,5`), negative hours, 0 hours, more than 24 hours, and days that are not a whole number from 1 to 7 (`0`, `8`, `2.5`). *Clear* resets the calculator. |

### Other details

- Every link, button and field can be reached with the **Tab** key and shows a visible focus outline.
- Error messages are linked to their fields with `aria-describedby` and marked with `aria-invalid`.
- User-entered text is displayed with `textContent`, so typed HTML is shown as plain text.
- The video and audio never autoplay.
- Without JavaScript, the page still works: all project details and all three photos are simply shown.

## Folder structure

```
My Web/
├── index.html          # the whole page: one h1, every section linked from the nav
├── README.md
├── css/
│   └── styles.css      # external stylesheet: palette, layout, media queries
├── js/
│   └── script.js       # the four JavaScript features
├── images/
│   ├── photo1.jpg
│   ├── photo2.jpg
│   └── photo3.jpg
└── videos/
    ├── video1.mp4      # introduction video
    └── voice.mp3       # audio clip
```

## Run it locally

Open the folder in VS Code and start **Live Server** on `index.html`. Alternatively, run
`python -m http.server` inside the folder and visit http://localhost:8000.

## Deployment (Render static site)

| Setting | Value |
|---------|-------|
| Root Directory | _leave blank_ (index.html is at the repository root) |
| Build Command | `echo "No build required"` |
| Publish Directory | `.` |
| Auto Deploy | On, for the `main` branch |

## Sources and credits

- All three photos, the introduction video and the audio clip are my own.
- [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Learn): reference for HTML, CSS and
  JavaScript (forms, `textContent`, `aria-*` attributes, CSS Grid and media queries).
- Fonts: [Rye, Zilla Slab and Source Sans 3](https://fonts.google.com/) from Google Fonts.
- AI assistance: Claude (Anthropic) helped restructure the page and write the CSS and JavaScript.
  The personal content, photos and media are my own.

&copy; 2026 Yande Sichula
