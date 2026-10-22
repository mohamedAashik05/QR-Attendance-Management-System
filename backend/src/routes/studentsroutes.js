import { Router } from "express";
import { NewRegisterOrUpdate } from '../config/db.js'

const router = Router()

router.post(["/api/StudentRegister", "/StudentRegister"], async (req, res) => {
    const data= req.body
    try {
        const result = await NewRegisterOrUpdate(data)
        res.status(201).json({
            message: "Student registered successfully",
            New_studentID: result.output.newStudentID,
            result
        })
    }
    catch (err) {                             
        res.status(500).json({ error: err.message })
    }
})
                                               
// router.get('/api/GetUserDetails/:ID', async (req, res) => {
//     const id = req.params.ID
//     if (!/^\d+$/.test(id)) {
//         return res.status(400).json({ error: "ID must be a positive integer" })
//     }

//     try {
//         const result = await USP_GetStudentDetails(id)
//         res.json(result.recordset)
//     }
//     catch (err) {
//         const status = err.originalError?.code === 50002 ? 404 : 500
//         res.status(status).json({ error: err.message })
//     }
// })

export default router