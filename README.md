# [Helios](https://madison-solar.dssdglobal.org)

DSSD is collaborating with Helios to create an Analytics page for the solar arrays on UW-Madison's campus. Data is collected by the solar arrays and by a solar irradiance meter on top of the engineering building.

### Project Management

To contribute to the project, assign an issue to yourself and create a new branch off of main and implement the feature/fix/improvement, making commits after completing each subsection of the work. Push your code and create a pull request (PR) into main linked to the issue it addresses.

PRs will be reviewed by at least one project member before merging.

### Development

To install dependencies, run:
```bash
npm run i-recur
```
This will install the dependencies for both the frontend and function directories.

You'll also have to login to firebase with:
```bash
firebase login
```

To serve the [Firebase emulator suite](https://firebase.google.com/docs/emulator-suite) and the frontend (connected to the emulators), run:
```bash
npm run dev
```
The dev server will refresh each time you save new changes to project files.

### Deployment

The frontend will automatically deploy on merge into main.

Backend:

To deploy the Firebase functions, change directory into [functions](functions) and run:
```bash
npm run deploy
```

To deploy the firestore rules or storage rules, run the following commands respectively from the root directory:
```bash
npm run deploy-firestore
npm run deploy-storage
```
