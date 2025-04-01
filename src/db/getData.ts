import { config } from "dotenv";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

config()

const collectionName = process.env.CODE_STATUS_COLLECTION_NAME;

export async function GetInputFileLink(docID: string) {
  const db = getFirestore();
  const docRef = db.collection(collectionName).doc(docID);
  try {
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new Error("Document does not exist");
    }

    return doc.data().InputfileLink;
  } catch (error) {
    console.log(error);

    return false;
  }
}

export async function updateStatus(
  docID: string,
  codeStatus: string,
  outputFileLink: string
) {
  const db = getFirestore();
  const docRef = db.collection(collectionName).doc(docID);
  try {
    await docRef.update({
      status: "finished",
      outputFileLink: outputFileLink,
      codeStatus: codeStatus,
      finishedAt: Timestamp.now(),
    });
  } catch (error) {
    console.log(error);
    return false;
  }
}
