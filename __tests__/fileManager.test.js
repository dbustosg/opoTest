class FileManager {
  constructor() {
    this.zones = { 1: { files: [] }, 2: { files: [] } };
  }
  addFile(zoneId, fileData) { this.zones[zoneId].files.push(fileData); }
  titleExists(zoneId, title) { return this.zones[zoneId].files.some(f => f.title === title); }
  getFiles(zoneId) { return this.zones[zoneId].files; }
  clearZone(zoneId) { this.zones[zoneId].files = []; }
  clearAll() { this.zones[1].files = []; this.zones[2].files = []; }
  hasFiles() { return this.zones[1].files.length > 0 || this.zones[2].files.length > 0; }
  getAllFilesWithConfig() {
    return [
      ...this.zones[1].files.map(f => ({ path: f.file.path, title: f.title, withAnswers: true })),
      ...this.zones[2].files.map(f => ({ path: f.file.path, title: f.title, withAnswers: false }))
    ];
  }
}

describe('FileManager', () => {
  let fileManager;

  beforeEach(() => {
    fileManager = new FileManager();
  });

  test('inicializa con zonas vacías', () => {
    expect(fileManager.getFiles('1')).toEqual([]);
    expect(fileManager.getFiles('2')).toEqual([]);
  });

  test('añade archivo a zona', () => {
    const fileData = { file: { path: '/test.html' }, title: 'Test' };
    fileManager.addFile('1', fileData);
    
    expect(fileManager.getFiles('1')).toHaveLength(1);
    expect(fileManager.getFiles('1')[0]).toEqual(fileData);
  });

  test('detecta títulos duplicados', () => {
    fileManager.addFile('1', { file: { path: '/test.html' }, title: 'Test' });
    
    expect(fileManager.titleExists('1', 'Test')).toBe(true);
    expect(fileManager.titleExists('1', 'Other')).toBe(false);
  });

  test('limpia zona específica', () => {
    fileManager.addFile('1', { file: { path: '/test.html' }, title: 'Test' });
    fileManager.addFile('2', { file: { path: '/test2.html' }, title: 'Test2' });
    
    fileManager.clearZone('1');
    
    expect(fileManager.getFiles('1')).toHaveLength(0);
    expect(fileManager.getFiles('2')).toHaveLength(1);
  });

  test('limpia todas las zonas', () => {
    fileManager.addFile('1', { file: { path: '/test.html' }, title: 'Test' });
    fileManager.addFile('2', { file: { path: '/test2.html' }, title: 'Test2' });
    
    fileManager.clearAll();
    
    expect(fileManager.getFiles('1')).toHaveLength(0);
    expect(fileManager.getFiles('2')).toHaveLength(0);
  });

  test('detecta si hay archivos', () => {
    expect(fileManager.hasFiles()).toBe(false);
    
    fileManager.addFile('1', { file: { path: '/test.html' }, title: 'Test' });
    expect(fileManager.hasFiles()).toBe(true);
  });

  test('obtiene archivos con configuración', () => {
    fileManager.addFile('1', { file: { path: '/test1.html' }, title: 'Test1' });
    fileManager.addFile('2', { file: { path: '/test2.html' }, title: 'Test2' });
    
    const result = fileManager.getAllFilesWithConfig();
    
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ path: '/test1.html', title: 'Test1', withAnswers: true });
    expect(result[1]).toEqual({ path: '/test2.html', title: 'Test2', withAnswers: false });
  });

  test('maneja múltiples archivos en misma zona', () => {
    fileManager.addFile('1', { file: { path: '/test1.html' }, title: 'Test1' });
    fileManager.addFile('1', { file: { path: '/test2.html' }, title: 'Test2' });
    
    expect(fileManager.getFiles('1')).toHaveLength(2);
  });
});
