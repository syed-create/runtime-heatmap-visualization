# Runtime Heatmap Visualization

An interactive heatmap visualization built with React and ECharts to display runtime data from power sources (Battery, Solar, Genset combinations).

![Runtime Report](https://img.shields.io/badge/React-18.2-blue) ![ECharts](https://img.shields.io/badge/ECharts-5.4-red) ![Vite](https://img.shields.io/badge/Vite-6.4-purple)

## 🔗 Links

-   **GitHub Repository**: https://github.com/syed-create/runtime-heatmap-visualization
-   **Live Demo**: https://runtime-heatmap-visualization-1vsdlx0cz.vercel.app

## 🎯 Features

-   **Interactive Heatmap**: Grid-based visualization showing runtime sources over time
-   **Date Range Filtering**: Select start and end dates to focus on specific periods
-   **Interactive Legend**: Click legend items to toggle visibility of specific power sources
-   **Zoom & Pan**: Built-in zoom controls with mouse wheel and drag support
-   **Export**: Download the chart as a high-resolution PNG image
-   **Live Updates**: Enable polling to automatically refresh data every 30 seconds
-   **Tooltips**: Hover over cells to see detailed information including date, time, source, and description
-   **Performance Optimized**: Progressive rendering for large datasets with lazy loading

## 🚀 Quick Start

### Prerequisites

-   Node.js 18+ and npm (Node.js 20+ recommended)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/syed-create/runtime-heatmap-visualization.git
cd runtime-heatmap-visualization
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser to the address shown (usually http://localhost:5173)

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
runtime-heatmap-visualization/
├── src/
│   ├── components/
│   │   ├── Chart/             # Chart-related components
│   │   │   ├── Heatmap.jsx
│   │   │   └── HeatmapChart.jsx
│   │   ├── Controls/          # Control panel components
│   │   │   └── Controls.jsx
│   │   ├── Legend/            # Legend components
│   │   │   └── Legend.jsx
│   │   └── Layout/            # Layout components
│   │       └── App.jsx
│   ├── utils/                 # Utilities and constants
│   │   └── constants.js
│   ├── styles/                # Stylesheets
│   │   └── styles.css
│   └── main.jsx               # Application entry point
├── public/
│   └── runtime.json           # Runtime data (meta + data)
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 📊 Data Format

The application expects a JSON file at `/public/runtime.json` with the following structure:

```json
{
	"meta": {
		"sources": [
			{
				"name": "RtBatt",
				"value": 1,
				"color": "#23CFE5",
				"display": "Battery",
				"desc": "Running on battery power"
			}
		]
	},
	"data": {
		"2024-01-01": [
			{
				"time": "00:00",
				"rtsources": 1
			}
		]
	}
}
```

### Data Field Mapping

-   `meta.sources[].value` → Maps to `data[date][].rtsources`
-   `meta.sources[].color` → Determines heatmap cell color
-   `meta.sources[].desc` → Displayed in tooltip on hover
-   `meta.sources[].display` → Legend label

## 🛠️ Tech Stack

-   **React 18.2** - UI framework
-   **ECharts 5.4** - Charting library
-   **echarts-for-react** - React wrapper for ECharts
-   **Vite 6.4** - Build tool and dev server
-   **PropTypes** - Runtime type checking
-   **Vanilla CSS** - Styling

## ⚡ Performance Features

-   **Code Splitting**: Lazy loading of HeatmapChart component with React.Suspense
-   **Memoization**: useMemo and React.memo to prevent unnecessary re-renders
-   **Progressive Rendering**: Large datasets rendered in chunks (5,000 points per chunk)
-   **Optimized Re-renders**: useCallback for stable function references

## 🎨 UI/UX Features

-   Clean, modern interface
-   Responsive layout
-   Accessible keyboard navigation for legend
-   Smooth animations and transitions
-   Visual feedback on interactions
-   Error states with retry functionality
-   Loading states

## 📝 Available Scripts

| Script            | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |

## 🐛 Troubleshooting

### Data not loading

-   Ensure `public/runtime.json` exists and is valid JSON
-   Check browser console for errors
-   Try the "Retry" button if an error message appears

### Chart not rendering

-   Clear browser cache and refresh
-   Check that all dependencies are installed (`npm install`)
-   Ensure you're using Node.js 18 or higher (20+ recommended)

## 📄 License

This project is for assessment purposes.

## 🙏 Acknowledgments

-   [ECharts](https://echarts.apache.org/) for the powerful charting library
-   [ECharts Heatmap Example](https://echarts.apache.org/examples/en/editor.html?c=heatmap-cartesian) for reference implementation
