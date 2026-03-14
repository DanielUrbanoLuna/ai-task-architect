# Arquitectura del proyecto

Este proyecto sigue **Clean Architecture**. Todas las contribuciones deben respetar esta estructura sin excepción.

## Capas

| Carpeta | Responsabilidad |
|---|---|
| `src/domain` | Entidades, interfaces de repositorio y reglas de negocio puras. Sin dependencias externas. |
| `src/application` | Casos de uso. Orquesta el dominio. No conoce frameworks ni bases de datos. |
| `src/infrastructure` | Implementaciones concretas: base de datos, APIs externas, servicios de terceros. |
| `src/presentation` | Componentes de UI, páginas de Next.js y lógica de presentación. |

## Reglas

- El flujo de dependencias es siempre hacia adentro: `presentation → application → domain`. Infrastructure implementa interfaces definidas en domain.
- **Nunca** importar desde una capa interior hacia una exterior.
- La lógica de negocio vive en `domain` y `application`, jamás en componentes de UI.
- Cualquier nuevo módulo debe ubicarse en la capa que le corresponda según esta arquitectura.
