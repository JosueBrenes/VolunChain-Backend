import { Router } from "express";
import NFTController from "../modules/nft/presentation/controllers/NFTController.stub";
import { body } from "express-validator";

const router = Router();

router.post(
  "/nfts",
  [
    body("userId").isUUID(),
    body("organizationId").isUUID(),
    body("description").isString().notEmpty(),
  ],
  NFTController.createNFT
);

router.get("/nfts/:id", NFTController.getNFTById);
router.get("/users/:userId/nfts", NFTController.getNFTsByUserId);
router.delete("/nfts/:id", NFTController.deleteNFT);

export default router;
