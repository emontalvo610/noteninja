import { promises as fs } from "fs"
import { NextResponse } from "next/server"
import { File } from "@web-std/file"
import PDFParser from "pdf2json"
import pdf from "pdf-parse"
import { v4 as uuidv4 } from "uuid"

export const POST = async (req: Request) => {
  const formData: FormData = await req.formData()
  const uploadedFiles = formData.getAll("filepond")
  let fileName = ""
  let parsedText = ""

  console.log("Uploaded files:", uploadedFiles)

  if (uploadedFiles && uploadedFiles.length > 0) {
    const uploadedFile = uploadedFiles[0]
    console.log("Uploaded file:", uploadedFile)

    // // Check if uploadedFile is of type File
    // if (uploadedFile instanceof File) {
    // Generate a unique filename
    fileName = uuidv4()

    // Convert the uploaded file into a temporary file
    const tempFilePath = `/tmp/${fileName}.pdf`

    // Convert ArrayBuffer to Buffer
    const fileBuffer = Buffer.from(await (uploadedFile as any).arrayBuffer())

    const data = await pdf(fileBuffer)

    parsedText = data.text

    // remove weird characters from the parsedText

    parsedText = parsedText.replace(/[^a-zA-Z0-9 ]/g, "")

    // Save the buffer as a file
    // await fs.writeFile(tempFilePath, fileBuffer)

    // Parse the pdf using pdf2json. See pdf2json docs for more info.

    // The reason I am bypassing type checks is because
    // the default type definitions for pdf2json in the npm install
    // do not allow for any constructor arguments.
    // You can either modify the type definitions or bypass the type checks.
    // I chose to bypass the type checks.
    // const pdfParser = new (PDFParser as any)(null, 1)

    // // See pdf2json docs for more info on how the below works.
    // pdfParser.on("pdfParser_dataError", (errData: any) =>
    //   console.log(errData.parserError)
    // )
    // pdfParser.on("pdfParser_dataReady", () => {
    //   //   console.log((pdfParser as any).getRawTextContent())
    //   parsedText = (pdfParser as any).getRawTextContent()
    //   console.log(parsedText)
    // })

    // pdfParser.loadPDF(tempFilePath)
    //   } else {
    //     console.log("Uploaded file is not in the expected format.")
    //   }
  } else {
    console.log("No files found.")
  }

  const response = NextResponse.json({
    parsedText,
  })
  response.headers.set("FileName", fileName)
  return response
}
