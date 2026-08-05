---
title: Week 1 Exercises Information
---

## Welcome to the first week of FIT2102!

JavaScript is the language of the web and widely used for both front-end and back-end development.

It is also a _multi-paradigm_ language. It has similar syntax to
imperative languages like C and Java, but also supports anonymous
functions that can be assigned to variables as values. Thus, we can
begin to explore some _functional-style_ programming.

**Please read the [JavaScript Intro](https://tgdwyer.github.io/javascript1/) in the course notes before attempting the exercises.**

**The video lectures on Moodle also provide an introduction.**

## Introduction to the code bundle

For the first half of semester we will be running, testing, and debugging our code in the Chrome browser (results may vary if you use a different browser).

We assume a Chrome browser, Windows desktop, and VSCode text editor. If you have a different type of machine everything should still work but details like how to open files and keyboard shortcuts may vary - we will assume you already know how to do this on your own machine.

We will be using the Node Package Manager `npm` to install our dependencies and the `vite` build tool to run our code and execute tests (you don't need to know what this is, just provided here for context).

Ensure you have installed Node.js and `npm`. You can follow the
[official instructions](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
to find how to do this on your operating system.

This bundle requires Node.js version **20.19+ or 22.12+**. To check what you
have, open a terminal and run:

```
node -v
```

If this prints an error, Node.js is not installed yet. If it prints a version
older than those above, install the latest LTS version from
[nodejs.org](https://nodejs.org/) before continuing. Older versions will fail
with a confusing error when you start the development server.

Each week you will be given a code bundle on Moodle. Once you unzip the bundle onto your local drive there will be a file called `package.json`.

### Running the code bundle

Open a terminal in the folder containing `package.json` (this should be the folder you just extracted).

1. Run `npm install` (installs the dependencies) and
2. `npm run dev` (starts the development server to access our code and tests), then
3. Look in the terminal and go to the url in your browser (e.g. http://localhost:5173/).

If you are on Windows and get an error that looks like this when running `npm` commands:

```
npm : File D: \nodejs\npm.ps1 cannot be loaded because running scripts is
disabled on this system. For more information, see about_Execution_Policies at
https:/go.microsoft.com/fwlink/?LinkID=135170.
At line:1 char: 1
+ npm install
+ ~~~
    + CategoryInfo          : SecurityError: (:) [], PSSecurityException
    + FullyQualifiedErrorId : UnauthorizedAccess
```

Run this command first:

```ps1
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

and then try running the `npm` commands again.

If `npm run dev` fails with an error like this:

```
You are using Node.js 18.19.0. Vite requires Node.js version 20.19+ or 22.12+.
Please upgrade your Node.js version.
```

your Node.js installation is too old. Install the latest LTS version from
[nodejs.org](https://nodejs.org/), close and reopen your terminal, and check
`node -v` again before re-running the commands above. (An outdated Node also
causes `EBADENGINE` warnings during `npm install`, which can be fixed the same way, i.e., by installing the latest LTS version.)

### Completing the exercises

The page served at that URL is `index.html`; it loads and tests **src/main.js**, which you will edit to complete the exercises. Scroll down on that page to see test results under each exercise.

The first time you open the URL, you will see lots of red `X` error messages from automated tests. These will go away as we implement solutions to each of the exercises.

We recommend the [VSCode](https://code.visualstudio.com/) editor to make your changes in **src/main.js**. You may use a different one if you have a strong editor preference.

To start VSCode, hit windows-key and type "code" and press enter.

Inside VSCode, go to File -\> Open Folder... and navigate to where you unzipped the code bundle.

Then click src/main.js in the Explorer to open it. Start writing code and press ctrl-s to save.

After making changes and saving in the editor, the server should automatically restart and refresh your browser page. If it does not, focus your terminal and press `r` then `Enter` to restart the server.
