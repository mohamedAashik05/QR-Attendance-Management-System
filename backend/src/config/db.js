import "dotenv/config";
import sql from "mssql/msnodesqlv8.js"

const config = {
  connectionString:
    `Driver={${process.env.DB_DRIVER || "ODBC Driver 18 for SQL Server"}};` +
    `Server=${process.env.DB_SERVER || "localhost"};` +
    `Database=${process.env.DB_DATABASE || "QRAttendanceDB"};` +
    `Trusted_Connection=${process.env.DB_TRUSTED_CONNECTION || "Yes"};` +
    `Encrypt=${process.env.DB_ENCRYPT || "No"};` +
    `TrustServerCertificate=${process.env.DB_TRUST_SERVER_CERTIFICATE || "Yes"};`
};
export async function NewRegisterOrUpdate(data) {
  const pool = await sql.connect(config);
  return pool
    .request()
    .input('UserDetails', sql.NVarChar(sql.MAX), JSON.stringify(data))
    .output('newStudentID', sql.Int)
    .execute('USP_NewRegisterOrUpdate')
}

export async function USP_AttendanceDetails(data) {
  const pool = await sql.connect(config)
  return pool
    .request()
    .input('AttendanceDetails', sql.NVarChar(sql.MAX), JSON.stringify(data))
    .execute('USP_AttendanceDetails')
}

export async function USP_GetStudentDetails(id) {
  const pool = await sql.connect(config)
  return pool
    .request()
    .input('students_ID', sql.NVarChar(sql.MAX), JSON.stringify({ Student_ID: Number(id) }))
    .execute('USP_GetStudentDetails')
}

export async function USP_Trainer_SignUP(TrainerDetails){
  const pool = await sql.connect(config)
  return pool
    .request()
    .input('TrainerDetails', sql.NVarChar(sql.MAX), JSON.stringify(TrainerDetails))
    .output('newTrainerID', sql.Int)
    .execute('USP_Trainer_SignUP')
}

export async function GetTrainerByEmail(email) {
  const pool = await sql.connect(config)
  const result = await pool
    .request()
    .input('Email_ID', sql.VarChar(90), email)
    .query(`
      SELECT trainer_ID, email, Password
      FROM dbo.T_Trainers
      WHERE email = @Email_ID
    `)

  return result.recordset[0] ?? null
}