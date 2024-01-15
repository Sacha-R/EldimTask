# EldimTask

Hello! Welcome to the EldimTask project. This project uses Django for the backend and a lite server for the frontend.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for testing purposes.

### Prerequisites

Before you start, make sure you have the following installed:

- Python 3
- Django
- Node.js and npm

### Installing

1. Clone the repository:

2. go to repository

open 2 terminals

1st one

```bash
cd EldimTask
pip install -r requirements.txt
python manage.py runserver
```

2nd one
```bash
cd redomProject
npm install
lite-server
```

Now you should be able to access the application at http://localhost:3000.

Project Steps

1. Configure public/private Git repository
Duration: 2 minutes

2. Create an empty Django project with a needed structure.
Duration: 15 minutes

3. Load a table, users using ‘loaddata’.
Duration: 15 minutes

4. Use RE:DOM and AG Grid to display it to the user.
Duration: 20 minutes

5. AG Grid: Load a table with a default ordering by Age Desc (after loading to AG Grid).
Create a menu on the right (below ‘Filters’) that will store filter set objects (apply grouping+filtering+ordering and to save it). After clicking new created item - table should be updated according to filters applied. Store this object into the browser local storage. Duration: 3 hours

6. Make Name cells look like a button, clicking on which - salary will be 10% increased with a fading effect without storing to DB.
Duration: 20 minutes

7. Make a refresh button inside AG Grid to re-load data from DB
Duration: 15 minutes

Enjoy exploring EldimTask!
