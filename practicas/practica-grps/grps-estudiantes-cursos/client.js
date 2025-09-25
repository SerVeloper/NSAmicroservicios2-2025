import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

const PROTO_PATH = "./proto/gestion.proto";

// Cargar el proto
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const proto = grpc.loadPackageDefinition(packageDefinition).gestion;

// Crear cliente
const client = new proto.GestionService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

// Función para manejar respuestas y errores
function callService(method, request) {
  return new Promise((resolve, reject) => {
    client[method](request, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
}

async function demo() {
  try {
    //Registrar un estudiante
    const estudiante = {
      ci: "12345",
      nombres: "Juan",
      apellidos: "Perez",
      carrera: "Informática",
    };
    const resEstudiante = await callService("AgregarEstudiante", estudiante);
    console.log("Estudiante agregado:", resEstudiante.estudiante);

    const estudiante2 = {
        ci: "8567706",
        nombres: "Sergio",
        apellidos: "Navarro",
        carrera: "Ingeniería",
    };
    const resEstudiante2 = await callService("AgregarEstudiante", estudiante2);
    console.log("Estudiante 2 agregado:", resEstudiante2.estudiante);

    //Registrar dos cursos
    const curso1 = {
      codigo: "CS101",
      nombre: "Introducción a la Programación",
      docente: "Dr. Smith",
    };
    const resCurso1 = await callService("AgregarCurso", curso1);
    console.log("Curso 1 agregado:", resCurso1.curso);

    const curso2 = {
      codigo: "CS202",
      nombre: "Bases de Datos",
      docente: "Dr. Johnson",
    };
    const resCurso2 = await callService("AgregarCurso", curso2);
    console.log("Curso 2 agregado:", resCurso2.curso);

    //Inscribir al estudiante en ambos cursos
    const inscripcion1 = { ci_estudiante: "12345", codigo_curso: "CS101" };
    const resInscripcion1 = await callService("InscribirEstudiante", inscripcion1);
    console.log("Inscripción 1:", resInscripcion1.mensaje);

    const inscripcion2 = { ci_estudiante: "12345", codigo_curso: "CS202" };
    const resInscripcion2 = await callService("InscribirEstudiante", inscripcion2);
    console.log("Inscripción 2:", resInscripcion2.mensaje);

    const inscripcion3 = { ci_estudiante: "8567706", codigo_curso: "CS101" };
    const resInscripcion3 = await callService("InscribirEstudiante", inscripcion3);
    console.log("Inscripción 3:", resInscripcion3.mensaje);

    // 4. Consultar los cursos del estudiante
    const reqCursos = { ci: "12345" };
    const listaCursos = await callService("ListarCursosDeEstudiante", reqCursos);
    console.log("Cursos del estudiante:", listaCursos.cursos);

    const reqCursos2 = { ci: "8567706" };
    const listaCursos2 = await callService("ListarCursosDeEstudiante", reqCursos2);
    console.log("Cursos del estudiante 2:", listaCursos2.cursos);

    //Consultar los estudiantes de un curso (por ejemplo, CS101)
    const reqEstudiantes = { codigo: "CS101" };
    const listaEstudiantes = await callService("ListarEstudiantesDeCurso", reqEstudiantes);
    console.log("Estudiantes del curso CS101:", listaEstudiantes.estudiantes);

    //Intentar inscribir a un alumno en un curso al que ya esta inscrito
    const inscripcion4= { ci_estudiante: "8567706", codigo_curso: "CS101" };
    const resInscripcion4= await callService("InscribirEstudiante", inscripcion4);
    console.log("Inscripción 4:", resInscripcion4.mensaje);

  } catch (err) {
    console.error("Error en la demostración:", err.message);
  }
}


demo();