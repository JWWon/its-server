import { createContainer, Lifetime, InjectionMode, asValue } from 'awilix'
import { logger } from './logger'

/**
 * Configures a new container.
 *
 * @return {Object} The container.
 */
export function configureContainer() {
  const opts = {
    // Classic means Awilix will look at function parameter
    // names rather than passing a Proxy.
    injectionMode: InjectionMode.CLASSIC
  }
  return createContainer(opts)
    .loadModules(['models/*.js'], {
      // `modulesToLoad` paths should be relative
      // to this file's parent directory.
      cwd: `${__dirname}/..`,
      formatName: name =>
        name
          .split('-')
          .map(n =>
            n.replace(
              /\w+/g,
              w => w[0].toUpperCase() + w.slice(1).toLowerCase()
            )
          )
          .join(''),
      resolverOptions: {
        lifetime: Lifetime.SINGLETON,
        register: asValue
      }
    })
    .register({
      // Our logger is already constructed,
      // so provide it as-is to anyone who wants it.
      logger: asValue(logger)
    })
}
