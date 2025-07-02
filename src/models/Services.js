const petServiceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    petType: { type: String, enum: ["dog", "cat"], required: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    discount: { type: Number, default: 0 },
    description: { type: String },
    images: [{ type: String }],
    mainImage: { type: String },
    hoverImage: { type: String },
    listProduct: [
      {
        id: { type: String },
        title: { type: String },
        price: { type: Number },
        oldPrice: { type: Number },
        discount: { type: Number },
        mainImage: { type: String },
        hoverImage: { type: String },
      },
    ],
  },
  { timestamps: true },
);

const PetService = mongoose.model("PetService", petServiceSchema);
export default PetService;
