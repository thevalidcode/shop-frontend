# Valid Shop - E-commerce Platform

A modern e-commerce platform built with React and Vite, featuring a responsive design, product management, shopping cart functionality, and user-friendly interface.

## Features

- 🛍️ **Product Catalog**

  - Detailed product listings with images, prices, and descriptions
  - Product categories and filtering
  - Product search functionality
  - Recently viewed products tracking
  - Stock quantity management
  - Seller information display

- �� **Shopping Cart**

  - Add/remove products
  - Quantity management with stock validation
  - Cart persistence using localStorage
  - Sticky cart interface on mobile
  - Out of stock handling

- 📱 **Responsive Design**

  - Mobile-first approach
  - Responsive layout for all screen sizes
  - Zoom functionality for product images
  - Adaptive grid layouts
  - Mobile-optimized navigation

- ⭐ **Product Reviews**

  - Star rating system
  - Review count display
  - Half-star support
  - Rating display in product cards

- 🔍 **Product Details**

  - Detailed product information
  - Image zoom functionality
  - Stock status indicators
  - Price comparison (current vs. original)
  - Related products section
  - Seller information display

- 👥 **Seller Information**
  - Seller name and location
  - Store rating
  - Response rate and time
  - Total sales
  - Join date

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Axios for API calls
- Boxicons for icons
- React Router for navigation
- JSON Server for mock API

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

4. Start the JSON server:

```bash
json-server --watch src/components/Shop/ProductsData.json --port 2000
```

5. Open your browser and navigate to `http://localhost:5173`

## Key Components

### ProductsDetails.jsx

- Displays detailed product information
- Handles product quantity management with stock validation
- Integrates with shopping cart
- Features image zoom functionality
- Shows stock status and availability
- Displays seller information
- Shows related products from same category
- Implements sticky cart interface

### ProductSellingSection.jsx

- Displays product categories
- Shows trending and recently viewed products
- Implements product filtering
- Handles product grid layout
- Manages product card display

### StarRating.jsx

- Renders star ratings for products
- Supports half-star ratings
- Shows review counts
- Displays rating in product cards

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
  brand: string,
  sku: string,
  stockQuantity: number,
  reviews: {
    rating: number,
    count: number
  },
  seller: {
    name: string,
    rating: number,
    location: string,
    joinDate: string,
    totalSales: number,
    responseRate: string,
    responseTime: string
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
- [JSON Server](https://github.com/typicode/json-server) for mock API
