import { PLANSINFO } from '@/assets/constants'
import jsPDF from 'jspdf'

export const findForms = (type, carrierCd, mvnoCd) => {
  const result = PLANSINFO.find((item) => item.code === type) // which type (postpaid or prepaid)
    ?.carriers.find((carrier) => carrier.code === carrierCd) // which carrier
    ?.mvnos.find((mvno) => mvno.code === mvnoCd) //which mvno

  return result
}

export const convertToPdfAndGetUrl = (base64Images) => {
  if (base64Images.length > 0) {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })

    const pdfWidth = doc.internal.pageSize.getWidth()
    const pdfHeight = doc.internal.pageSize.getHeight()

    base64Images.forEach((imgData, index) => {
      const imgProps = doc.getImageProperties(imgData)
      let imgWidth = pdfWidth
      let imgHeight = (imgProps.height * pdfWidth) / imgProps.width

      if (imgHeight > pdfHeight) {
        imgHeight = pdfHeight
        imgWidth = (imgProps.width * pdfHeight) / imgProps.height
      }

      const x = (pdfWidth - imgWidth) / 2 // centers the image horizontally
      const y = (pdfHeight - imgHeight) / 2 // centers the image vertically

      doc.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight)

      if (index < base64Images.length - 1) doc.addPage()
    })

    const pdfBlob = doc.output('blob')
    const pdfUrl = URL.createObjectURL(pdfBlob)

    return pdfUrl
  }

  return null
}

export const formatDate = (today) => {
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0') // Months are 0-indexed
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const isValidPassword = (password) => {
  const minLength = 8
  const uppercasePattern = /[A-Z]/
  const numberPattern = /[0-9]/
  const specialCharPattern = /[!@#$&~*%^?]/

  if (password.length < minLength) {
    return false
  }
  if (!uppercasePattern.test(password)) {
    return false
  }
  if (!numberPattern.test(password)) {
    return false
  }
  if (!specialCharPattern.test(password)) {
    return false
  }
  return true
}
