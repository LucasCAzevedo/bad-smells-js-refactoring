export class ReportGenerator {
  constructor(database) {
    this.db = database;
  }

  /**
   * Gera um relatório de itens baseado no tipo e no usuário.
   * - Admins veem tudo.
   * - Users comuns só veem itens com valor <= 500.
   */
  generateReport(reportType, user, items) {
    const visibleItems = items.filter((item) => this._canViewItem(user, item));
    const total = visibleItems.reduce((sum, item) => sum + item.value, 0);
    const rows = visibleItems.map((item) => this._formatRow(reportType, user.name, item));

    return this._buildHeader(reportType, user) + rows.join('') + this._buildFooter(reportType, total).trim();
  }

  _canViewItem(user, item) {
    return user.role === 'ADMIN' || item.value <= 500;
  }

  _formatRow(reportType, userName, item) {
    if (reportType === 'CSV') {
      return this._formatCsvRow(userName, item);
    }

    return this._formatHtmlRow(item);
  }

  _formatCsvRow(userName, item) {
    return `${item.id},${item.name},${item.value},${userName}\n`;
  }

  _formatHtmlRow(item) {
    const isPriority = item.value > 1000;
    const style = isPriority ? ' style="font-weight:bold;"' : '';
    return `<tr${style}><td>${item.id}</td><td>${item.name}</td><td>${item.value}</td></tr>\n`;
  }

  _buildHeader(reportType, user) {
    if (reportType === 'CSV') {
      return 'ID,NOME,VALOR,USUARIO\n';
    }

    return '<html><body>\n' +
      '<h1>Relatório</h1>\n' +
      `<h2>Usuário: ${user.name}</h2>\n` +
      '<table>\n' +
      '<tr><th>ID</th><th>Nome</th><th>Valor</th></tr>\n';
  }

  _buildFooter(reportType, total) {
    if (reportType === 'CSV') {
      return '\nTotal,,\n' + `${total},,\n`;
    }

    return '</table>\n' + `<h3>Total: ${total}</h3>\n` + '</body></html>\n';
  }
}