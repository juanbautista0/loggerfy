import { Loggerfy, LoggerLevel, LogEntry } from '../src/index'

describe('Logger', () => {
  let logger: ReturnType<Loggerfy['info']>;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    logger = new Loggerfy().info();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('Debe permitir encadenar métodos y establecer valores correctamente', () => {
    logger
      .setCode('TEST_001')
      .setMessage('Mensaje de prueba')
      .setDetail('Detalle del error')
      .setMetadata({ key: 'value' });

    expect(logger).toHaveProperty('code', 'TEST_001');
    expect(logger).toHaveProperty('message', 'Mensaje de prueba');
    expect(logger).toHaveProperty('detail', 'Detalle del error');
    expect(logger).toHaveProperty('metadata', { key: 'value' });
  });

  it('Debe generar un log válido cuando se llama a write', () => {
    process.env.NODE_ENV = 'test';

    logger
      .setCode('TEST_001')
      .setMessage('Mensaje de prueba')
      .setDetail('Detalle del error')
      .setMetadata({ userId: 42 })
      .write();

    expect(consoleSpy).toHaveBeenCalledTimes(1);

    const logEntry = JSON.parse(consoleSpy.mock.calls[0][0]);


    expect(logEntry.timestamp).toMatch(
      /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/
    );

    // Restaurar mocks después de la prueba
    jest.restoreAllMocks();
  });

  it('No debe generar un log si faltan código, mensaje o detalle', () => {
    logger.setCode('MISSING_FIELDS').write();
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it('Debe resetear los valores después de llamar write', () => {
    logger
      .setCode('RESET_TEST')
      .setMessage('Mensaje de prueba')
      .setDetail('Detalle de prueba')
      .setMetadata({ data: 123 })
      .write();

    expect(logger).toHaveProperty('code', '');
    expect(logger).toHaveProperty('message', '');
    expect(logger).toHaveProperty('detail', '');
    expect(logger).toHaveProperty('metadata', {});
  });

  it('Debe retornar log en formato json', () => {
    const log = logger
      .setCode('RESET_TEST')
      .setMessage('Mensaje de prueba')
      .setDetail('Detalle de prueba')
      .setMetadata({ data: 123 })
      .getLog();

    const logObject = JSON.parse(log) as LogEntry;
    expect(logObject.code).toEqual('RESET_TEST');
  });
});

describe('Loggerfy', () => {
  let LoggerfyInstance: Loggerfy;

  beforeEach(() => {
    LoggerfyInstance = new Loggerfy();
  });

  it('Debe crear instancias de Logger con el nivel correcto', () => {
    expect(LoggerfyInstance.info()).toHaveProperty('level', LoggerLevel.INFO);
    expect(LoggerfyInstance.warn()).toHaveProperty('level', LoggerLevel.WARNING);
    expect(LoggerfyInstance.error()).toHaveProperty('level', LoggerLevel.ERROR);
  });
});