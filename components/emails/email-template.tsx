import type * as React from "react"

interface EmailTemplateProps {
  firstName: string
  idSolicitud: string
  estadoSolicitud: string
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({ firstName, idSolicitud, estadoSolicitud }) => (
  <div
    style={{
      fontFamily: "Arial, sans-serif",
      maxWidth: "600px",
      margin: "0 auto",
      padding: "20px",
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      border: "1px solid #f87171",
      borderTop: "4px solid #f87171",
    }}
  >
    {/* Header */}
    <div
      style={{
        textAlign: "center",
        padding: "20px 0",
        borderBottom: "1px solid #f0f0f0",
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#fef2f2",
          padding: "15px",
          borderRadius: "6px",
        }}
      >
        <img src="https://images-macrocode.s3.us-east-2.amazonaws.com/sai_logo_red.svg?response-content-disposition=inline&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAAaCXVzLWVhc3QtMiJHMEUCIQDK1QANrAPGBK0DPAvIhK5yI3wxhy9vi9e5sdZbrESmyAIgbogkxi5rmAnios18DI0R4hZ9v89V9PeEwRqQm57%2FA0oqywMIeRACGgw5MzI5MDAzMDMzMzQiDHHztS3noCsweQAzOCqoA3yNXGqvDeSxRmADzE1LKTT7LQQKgJDgR%2BnJj4OJqKu5m1zhBh9KphofqocRNt%2FnAJbebcUNBNC28oztV3M%2BKAb4TXWB2hvTotG50NWp19UuOnm1cQp81RHvpBt9usf9rJZnxveMRpSBZN8ZrLGtXvLdpZFp%2B79P%2Fy%2FDOjtt9RJmbAwvoLy0PApmG%2FhAkF09%2FQvGodO2VDGRSlg5EzNalWv561p1TcviuJ9pHj9fFKWrO5nW8y2pKboHzev9JeKvaRaX%2Fz9oBTrqi8gl1jSKdpkTrXUaPkTzJiefnl99oh%2FD01CpXWSzlmp8I2Ltc0BIIpbagPb190wADIbnEsQ3Npm6T%2FVGt%2F3E40V3dfLdj243WNORe2s%2BaUuO0nqyzc9tq17OwG9ExYEP0x4c8rcQOMRbtO2naXLtAn7W%2FbbK42ksxsZfon6mTYuIuq6DvdQJnes9xcm6neuIJ8O%2F8Dt86%2Bj%2FnKcu50ZCeFxe%2FGhY8CvrXYkvvfgnLMwNEkJrAnwRZlNmSgMgHUN4Zd0qOkiTmhGI47wV7OOwmuGAIGagQYzXwozKy6g3%2Ftgwlo7VvwY65AIdh9m90yg%2FHljoBWnnnTTce9sIpQi7N%2BBoZ3WYn8GKrZLzVYSroHipbHKcfFMt2TAnPKbuW7QAdv%2FGwWMLVCROGzQl7K4gnlLwCdadtxrLXrkg9pwI3dqsu6NMqNKBO%2BrqTfrPO0dOHarbFmhwK86NOE18MkM99pjbx6n5SiNlfJyMrzLiudDZ8JsLamP%2F8qDy199KloYY5yLpwrw9XvvOs32jHM9xMoqR8W1S8ENkeEoMdmRKN9rrZes1P%2Bff5cDXjjFkpQsQ5jW0BP1zkphrWot78TxUtXkUsLm9eRMTAfs5DfSiUM%2FYRhkIUVHsAgC4TlQjWOIn9t9l7k%2Fqw%2BirWrlEnMaxcZ8rV6vGv3aMJeFCEJ4QvzyQ%2BimRQ0wvOiIHpqRW%2FyQgD%2FBZWQB6cpQx9a4Ett6GKsfpp%2Foed4jfZOTjoKEe1OmeBfXtwLladrO98tr712XOZjqRhF2%2Bop5d7e9GhA%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIA5SNJQ6HTENZBQNEW%2F20250408%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20250408T155929Z&X-Amz-Expires=43200&X-Amz-SignedHeaders=host&X-Amz-Signature=362e98616b63d0e39f343ec67feaf7e62a3937e3c5944e14b327f24e3f3936ba" alt="Logo" style={{ height: "60px", maxWidth: "200px" }} />
      </div>
    </div>

    {/* Content */}
    <div style={{ padding: "0 20px" }}>
      <h1
        style={{
          color: "#f87171",
          fontSize: "24px",
          marginBottom: "20px",
        }}
      >
        Hola, {firstName}
      </h1>

      <p
        style={{
          color: "#555555",
          fontSize: "16px",
          lineHeight: "1.5",
          marginBottom: "15px",
        }}
      >
        Tu solicitud con ID <strong style={{ color: "#333333" }}>{idSolicitud}</strong> ha cambiado de estado.
      </p>

      <div
        style={{
          backgroundColor: "#f9f9f9",
          padding: "15px",
          borderRadius: "6px",
          marginBottom: "20px",
          borderLeft: "4px solid #f87171",
        }}
      >
        <p
          style={{
            margin: "0",
            fontSize: "16px",
            color: "#333333",
          }}
        >
          Nuevo estado: <strong>{estadoSolicitud}</strong>
        </p>
      </div>
    </div>
  </div>
)
