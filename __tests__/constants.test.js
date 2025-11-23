const constants = require('../src/shared/constants');

describe('Constants', () => {
  test('define MAX_FILES', () => {
    expect(constants.MAX_FILES).toBe(10);
  });

  test('define ALLOWED_EXTENSION', () => {
    expect(constants.ALLOWED_EXTENSION).toBe('.html');
  });

  test('define PDF_CONFIG', () => {
    expect(constants.PDF_CONFIG).toEqual({
      pageSize: 'A4',
      printBackground: true,
      margins: { top: 0.2, bottom: 0.2, left: 0, right: 0 }
    });
  });

  test('define IPC_CHANNELS', () => {
    expect(constants.IPC_CHANNELS).toHaveProperty('SELECT_FOLDER');
    expect(constants.IPC_CHANNELS).toHaveProperty('SELECT_FILES');
    expect(constants.IPC_CHANNELS).toHaveProperty('CONVERT_MULTIPLE');
    expect(constants.IPC_CHANNELS).toHaveProperty('SHOW_ERROR');
    expect(constants.IPC_CHANNELS).toHaveProperty('SHOW_SUCCESS');
  });

  test('IPC_CHANNELS tiene valores correctos', () => {
    expect(constants.IPC_CHANNELS.SELECT_FOLDER).toBe('select-folder');
    expect(constants.IPC_CHANNELS.SELECT_FILES).toBe('select-files');
    expect(constants.IPC_CHANNELS.CONVERT_MULTIPLE).toBe('convert-multiple');
  });
});
