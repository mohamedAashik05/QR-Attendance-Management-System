import { Router } from "express";
import { USP_AttendanceDetails } from "../config/db.js"
import { VerifyQrToken } from "./trainerAuthRoute.js";

const router = Router()
const attendancePath = "/api/AttendanceEntry"

function normalizeCheckinTime(value) {
    if (typeof value !== "string") return null

    const match = value.trim().match(/^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})(?::(\d{2}))?$/)
    if (!match) return null

    const isoValue = `${match[1]}T${match[2]}:${match[3] ?? "00"}`
    const date = new Date(isoValue)
    if (Number.isNaN(date.getTime())) return null

    return `${match[1]} ${match[2]}:${match[3] ?? "00"}`
}

router.post(attendancePath, VerifyQrToken, async (req, res) => {
    const studentID = Number(req.body.student_ID ?? req.body.Student_ID)
    const checkinTime = normalizeCheckinTime(req.body.checkin_time ?? req.body.CheckIn)

    if (!Number.isInteger(studentID) || studentID <= 0) {
        return res.status(400).json({ error: "A valid student_ID is required" })
    }
    if (!checkinTime) {
        return res.status(400).json({ error: "A valid checkin_time is required" })
    }

    const data = {
        student_ID: studentID,
        checkin_time: checkinTime,
    }

    try {
        const result = await USP_AttendanceDetails(data)
        return res.status(201).json({
            message: "Attendance registered successfully",
            result,
        })
    }
    catch (err) {
        console.error("Attendance registration failed:", err)
        return res.status(500).json({ error: "Unable to register attendance" })
    }
})

export default router