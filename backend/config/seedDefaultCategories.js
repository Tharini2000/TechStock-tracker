import Category from "../models/Category.js";

const defaultCategories = [
  {
    categoryName: "TechStock Items",
    description: "Core electronic inventory and components"
  },
  {
    categoryName: "Fashion Items",
    description: "Wearables and fashion-related stock"
  },
  {
    categoryName: "Mobile Items",
    description: "Mobile devices and accessories"
  },
  {
    categoryName: "Digital Items",
    description: "Digital devices and smart gadgets"
  },
  {
    categoryName: "Kitchen Items",
    description: "Kitchen electronics and appliance items"
  }
];

const seedDefaultCategories = async () => {
  for (const category of defaultCategories) {
    const exists = await Category.findOne({ categoryName: category.categoryName });
    if (!exists) {
      await Category.create(category);
    }
  }
};

export default seedDefaultCategories;