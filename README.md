# Valid Shop - E-commerce Platform

A modern e-commerce platform built with React and Vite, featuring a responsive design, product management, shopping cart functionality, and user-friendly interface.

## Features

- 🛍️ **Product Catalog**

  - Detailed product listings with images, prices, and descriptions
  - Product categories and filtering
  - Product search functionality
  - Recently viewed products tracking

- 🛒 **Shopping Cart**

  - Add/remove products
  - Quantity management
  - Stock validation
  - Cart persistence using localStorage

- 📱 **Responsive Design**

  - Mobile-first approach
  - Responsive layout for all screen sizes
  - Zoom functionality for product images

- ⭐ **Product Reviews**

  - Star rating system
  - Review count display
  - Half-star support

- 🔍 **Product Details**
  - Detailed product information
  - Image zoom functionality
  - Stock status indicators
  - Price comparison (current vs. original)

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Axios for API calls
- Boxicons for icons
- React Router for navigation

## Project Structure

```
src/
├── components/
│   ├── Shop/
│   │   ├── ProductsData.json    # Product catalog data
│   │   └── ProductSellingSection.jsx
│   ├── ProductDetail/
│   │   └── ProductsDetails.jsx
│   ├── StarRating.jsx
│   └── magicui/
│       └── lens.jsx            # Image zoom component
├── lib/
│   ├── addCart.js             # Cart management functions
│   ├── Currency.js            # Currency formatting
│   └── viewedProducts.js      # Recently viewed products tracking
└── App.jsx
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/valid-shop.git
cd valid-shop
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Key Components

### ProductsDetails.jsx

- Displays detailed product information
- Handles product quantity management
- Integrates with shopping cart
- Features image zoom functionality
- Shows stock status and availability

### ProductSellingSection.jsx

- Displays product categories
- Shows trending and recently viewed products
- Implements product filtering

### StarRating.jsx

- Renders star ratings for products
- Supports half-star ratings
- Shows review counts

## Data Structure

### Product Object

```javascript
{
  productId: number,
  name: string,
  slug: string,
  price: number,
  beforePrice: number,
  description: string,
  image: string,
  category: string,
  stat: number,
  availabilityStatus: "In Stock" | "Out of Stock",
  brand: string,
  sku: string,
  stockQuantity: number,
  reviews: {
    rating: number,
    count: number
  }
}
```

## API Integration

The project uses a local JSON server for product data. To set up the API:

1. Install json-server:

```bash
npm install -g json-server
```

2. Start the JSON server:

```bash
json-server --watch src/components/Shop/ProductsData.json --port 2000
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Boxicons](https://boxicons.com/) for the icon library
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [React Router](https://reactrouter.com/) for navigation
