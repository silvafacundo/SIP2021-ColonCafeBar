# Seminario de Integración Profesional

## Colon Café Bar - Chivilcoy

### Profesores
   - Viviana Chapetto
   - David Petrocelli
   - Mariano Rappaport

### Autores
   - Facundo Silva - 162115
   - Lucas Rivero - 162114
   - Franco Zoia - 148488
   - Manuel Seligmann - 162624 
   - Facundo Bobadilla - 143482
   - Nicolas Sciarrotta - 141707

#### Documentacion
   - Enlace a la [EGR](https://sipunlu2021.atlassian.net/wiki/spaces/CCB/pages/35422209/EGR+-+PROYECTO) + diagrama de clases.
   - Enlace a [JIRA](https://sipunlu2021.atlassian.net/jira/software/c/projects/CCB/boards/1/roadmap).
   - Enlace a la [PPTS](/files) de venta y negocio.
   - Enlace al [SISTEMA](https://backend-silvafacundo.cloud.okteto.net/).

   - Para acceder a los repositorios o parte administrativa del sistema, escribir un correo a dpetrocelli@unlu.edu.ar y se le otorgarán las credenciales de acceso
#### Arquitectura
   - Para el [backend](/backend) se utilizó:
       - Como servidor NodeJS[1]. 
       - Para la persistencia de datos, se utilizó PostgreSQL[2] y un query builder denominado Knexjs[3].
       
   - Para [frontend](/frontend) se optó por utilizar: 
       - VueJS[4] acompañado con Bueffy[5] y CSS[6]
   
   - Para [Testing](/testing) se optó por utilizar: 
       - MochaJS[7] y Selenium[8]
   
   - También se utilizó Docker[9] y Kubernetes[10] para montar el sistema en Okteto. 

#### Referencias
   - [1]. [NodeJS](https://nodejs.org/es/docs/).
   - [2]. [PostgreSQL](https://www.postgresql.org/docs/).
   - [3]. [KnexJS](http://knexjs.org/).
   - [4]. [VueJS](https://vuejs.org/).
   - [5]. [Bueffy](https://buefy.org/).
   - [6]. [CSS](https://developer.mozilla.org/es/docs/Web/CSS).
   - [7]. [MochaJS](https://mochajs.org/).
   - [8]. [Selenium](https://www.selenium.dev/).
   - [9]. [Docker](https://docs.docker.com/).
   - [10]. [Kubernetes](https://kubernetes.io/es/docs/home/).