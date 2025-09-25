import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

const PROTO_PATH = "./proto/gestion.proto";

// Cargar el proto con opciones recomendadas
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const proto = grpc.loadPackageDefinition(packageDefinition).gestion;

// Base de datos en memoria
const estudiantes = [];
const cursos = [];     
const inscripcionesPorEstudiante = new Map(); 
const inscripcionesPorCurso = new Map(); 

// Implementación de los métodos
const serviceImpl = {
  AgregarEstudiante: (call, callback) => {
    const nuevoEstudiante = call.request;
    // Verificar si ya existe (por ci única)
    if (estudiantes.find(e => e.ci === nuevoEstudiante.ci)) {
      return callback({
        code: grpc.status.ALREADY_EXISTS,
        message: "Estudiante ya existe",
      });
    }
    estudiantes.push(nuevoEstudiante);
    inscripcionesPorEstudiante.set(nuevoEstudiante.ci, []);
    callback(null, { estudiante: nuevoEstudiante });
  },

  AgregarCurso: (call, callback) => {
    const nuevoCurso = call.request;
    // Verificar si ya existe (por codigo único)
    if (cursos.find(c => c.codigo === nuevoCurso.codigo)) {
      return callback({
        code: grpc.status.ALREADY_EXISTS,
        message: "Curso ya existe",
      });
    }
    cursos.push(nuevoCurso);
    inscripcionesPorCurso.set(nuevoCurso.codigo, []);
    callback(null, { curso: nuevoCurso });
  },

  InscribirEstudiante: (call, callback) => {
    const { ci_estudiante, codigo_curso } = call.request;

    // Verificar si estudiante y curso existen
    const estudiante = estudiantes.find(e => e.ci === ci_estudiante);
    const curso = cursos.find(c => c.codigo === codigo_curso);
    if (!estudiante) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: "Estudiante no encontrado",
      });
    }
    if (!curso) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: "Curso no encontrado",
      });
    }

    // Verificar si ya está inscrito
    const cursosDelEstudiante = inscripcionesPorEstudiante.get(ci_estudiante) || [];
    if (cursosDelEstudiante.includes(codigo_curso)) {
      return callback({
        code: grpc.status.ALREADY_EXISTS,
        message: "Estudiante ya inscrito en este curso",
      });
    }

    // Inscribir
    cursosDelEstudiante.push(codigo_curso);
    inscripcionesPorEstudiante.set(ci_estudiante, cursosDelEstudiante);

    const estudiantesDelCurso = inscripcionesPorCurso.get(codigo_curso) || [];
    estudiantesDelCurso.push(ci_estudiante);
    inscripcionesPorCurso.set(codigo_curso, estudiantesDelCurso);

    callback(null, { mensaje: "Inscripción exitosa" });
  },

  ListarCursosDeEstudiante: (call, callback) => {
    const { ci } = call.request;
    const cursosDelEstudiante = inscripcionesPorEstudiante.get(ci) || [];
    const listaCursos = cursosDelEstudiante.map(codigo => 
      cursos.find(c => c.codigo === codigo)
    ).filter(c => c);  // Filtrar nulos por si hay inconsistencias
    callback(null, { cursos: listaCursos });
  },

  ListarEstudiantesDeCurso: (call, callback) => {
    const { codigo } = call.request;
    const estudiantesDelCurso = inscripcionesPorCurso.get(codigo) || [];
    const listaEstudiantes = estudiantesDelCurso.map(ci => 
      estudiantes.find(e => e.ci === ci)
    ).filter(e => e);  // Filtrar nulos por si hay inconsistencias
    callback(null, { estudiantes: listaEstudiantes });
  },
};

// Crear servidor
const server = new grpc.Server();
server.addService(proto.GestionService.service, serviceImpl);

const PORT = "50051";
server.bindAsync(
  `0.0.0.0:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  (err, bindPort) => {
    if (err) {
      console.error("Error al vincular el servidor:", err);
      process.exit(1);
    }
    console.log(`Servidor gRPC escuchando en ${bindPort}`);
  }
);