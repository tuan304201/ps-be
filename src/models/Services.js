const petServiceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    petType: { type: String, enum: ["dog", "cat"], required: true },
    price: { type: Number, required: true },
    description: { type: String },
    images: [{ type: String }],
  },
  { timestamps: true },
);

const PetService = mongoose.model("PetService", petServiceSchema);
export default PetService;
