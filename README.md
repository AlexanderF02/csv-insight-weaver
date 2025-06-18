**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## What functions is not working in this project? 
-The AI function does not work as intended:
Instead of analyzing the data and providing insights, the AI function only returns a default response:
"Analysis Result I can analyze your invoice data to find patterns, totals, and insights. Try asking about totals, averages, highest values, or customer statistics."
It does not perform any actual analysis, but only displays a preset message.

-CSV upload does not work:
It is not possible to upload your own CSV files. Instead, only test data that is currently hardcoded is displayed.

-Filtering does not show the correct data:
When attempting to filter by specific values, the filtered result is not as expected. The filtering function does not work correctly.

-No database – all data is stored locally:
There is no database connected to the project. All data is handled and stored in the browser’s localStorage, which limits functionality and persistence.

-Dashboard editing does not work:
The ability to edit the dashboard depends on the other functions above, and since they do not work as intended, it is also not possible to edit the dashboard.

## Website link to vercel: csv-insight-weaver.vercel.app
