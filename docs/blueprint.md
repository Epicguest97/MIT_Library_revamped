# **App Name**: LinkFinder

## Core Features:

- Hierarchical Dropdowns: Implement dropdown menus for each level of the path hierarchy (e.g., Year, Semester, Branch, etc.) to allow users to progressively filter the JSON data.
- JSON Parsing and Indexing: Parse the provided JSON data and create an in-memory index to efficiently search for URLs based on the selected path criteria.
- Search Results Display: Display the search results as a list of clickable links. Ensure each link opens the PDF in a new tab.

## Style Guidelines:

- Primary color: Light gray (#F5F5F5) for the background to provide a clean interface.
- Secondary color: White (#FFFFFF) for containers and cards to create visual separation.
- Accent: Teal (#008080) for interactive elements like dropdowns and links to draw attention.
- Use a simple, single-column layout to ensure ease of navigation and readability.
- Use minimal icons for dropdowns to indicate their interactive nature.

## Original User Request:
see i want to make a very basic ui  website that has dropdowns like and from that saerches pdf.json to give a set of links in that json the json is like {
    "path": [
      "2024",
      "Dec 2023-Jan 2024",
      "B.Tech",
      "III Sem",
      "ICT",
      "IT"
    ],
    "name": "",
    "url": "https://libportal.manipal.edu/MIT/Open%20Access/SOP_IEEE_2023.pdf"
  },
  {
    "path": [
      "2024",
      "Dec 2023-Jan 2024",
      "B.Tech",
      "III Sem",
      "ICT",
      "IT"
    ],
    "name": "",
    "url": "https://libportal.manipal.edu/MIT/Open%20Access/SOP_RSC_2023.pdf"
  },
  