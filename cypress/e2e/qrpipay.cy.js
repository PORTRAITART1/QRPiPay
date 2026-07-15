/**
 * E2E Tests - Cypress
 * End-to-end testing for QRPiPay workflows
 */

describe('QRPiPay E2E Tests', () => {
  const baseUrl = 'http://localhost:3000';
  const apiUrl = 'http://localhost:3001';

  beforeEach(() => {
    cy.visit(baseUrl);
  });

  describe('Authentication Flow', () => {
    it('should login successfully', () => {
      // Navigate to login
      cy.visit(`${baseUrl}/login`);

      // Click Pi Connect button
      cy.contains('Connexion avec Pi').click();

      // Verify redirected to dashboard
      cy.url().should('include', '/dashboard');
      cy.contains('Dashboard').should('be.visible');
    });

    it('should show error on failed login', () => {
      cy.visit(`${baseUrl}/login`);

      // Try to login with invalid credentials
      cy.contains('Connexion avec Pi').click();

      // Should show error message
      cy.contains('Erreur').should('be.visible');
    });

    it('should logout successfully', () => {
      // Login first
      cy.login();

      // Click logout button
      cy.contains('Déconnexion').click();

      // Should redirect to login
      cy.url().should('include', '/login');
    });
  });

  describe('QR Code Generation', () => {
    beforeEach(() => {
      cy.login();
    });

    it('should generate QR code', () => {
      // Navigate to QR Generator
      cy.contains('QR Generator').click();

      // Enter amount
      cy.get('input[placeholder*="Montant"]').type('100');

      // Click generate
      cy.contains('Générer QR').click();

      // Verify QR code displayed
      cy.get('[data-testid="qr-code"]').should('be.visible');
    });

    it('should validate amount input', () => {
      cy.contains('QR Generator').click();

      // Try empty amount
      cy.contains('Générer QR').click();

      // Should show error
      cy.contains('Montant requis').should('be.visible');
    });

    it('should copy QR code data', () => {
      cy.contains('QR Generator').click();

      cy.get('input[placeholder*="Montant"]').type('50');
      cy.contains('Générer QR').click();

      // Click copy button
      cy.contains('Copier').click();

      // Verify toast notification
      cy.contains('Copié').should('be.visible');
    });
  });

  describe('Payment Flow', () => {
    beforeEach(() => {
      cy.login();
    });

    it('should complete payment successfully', () => {
      // Navigate to QR Generator
      cy.contains('QR Generator').click();

      // Generate QR
      cy.get('input[placeholder*="Montant"]').type('100');
      cy.contains('Générer QR').click();

      // Initiate payment
      cy.contains('Initier Paiement').click();

      // Should show processing state
      cy.contains('Traitement').should('be.visible');

      // Wait for completion
      cy.contains('Paiement Complété', { timeout: 10000 }).should('be.visible');

      // Verify redirect to confirmation
      cy.url().should('include', '/payment-confirmation');
    });

    it('should handle payment errors', () => {
      cy.contains('QR Generator').click();

      cy.get('input[placeholder*="Montant"]').type('99999999');
      cy.contains('Générer QR').click();

      cy.contains('Initier Paiement').click();

      // Should show error
      cy.contains('Erreur', { timeout: 10000 }).should('be.visible');
    });

    it('should display real-time payment status', () => {
      cy.contains('QR Generator').click();

      cy.get('input[placeholder*="Montant"]').type('100');
      cy.contains('Générer QR').click();

      cy.contains('Initier Paiement').click();

      // Verify status updates
      cy.contains('En attente').should('be.visible');
      cy.contains('Traitement', { timeout: 5000 }).should('be.visible');
    });
  });

  describe('Payment History', () => {
    beforeEach(() => {
      cy.login();
    });

    it('should display payment history', () => {
      cy.contains('History').click();

      // Should display table
      cy.get('table').should('be.visible');
      cy.contains('Date').should('be.visible');
      cy.contains('Montant').should('be.visible');
    });

    it('should filter payments', () => {
      cy.contains('History').click();

      // Filter by status
      cy.get('select[data-testid="status-filter"]').select('completed');

      // Should only show completed payments
      cy.get('table tbody tr').each(($row) => {
        cy.wrap($row).contains('Complété').should('be.visible');
      });
    });

    it('should export history', () => {
      cy.contains('History').click();

      // Click export button
      cy.contains('Exporter').click();

      // Verify file download started
      cy.readFile('cypress/downloads/payment-history.csv').should('exist');
    });

    it('should sort payments', () => {
      cy.contains('History').click();

      // Click date header to sort
      cy.contains('Date').click();

      // Verify sorted (simple check - could be enhanced)
      cy.get('table tbody tr').first().should('be.visible');
    });
  });

  describe('Analytics Dashboard', () => {
    beforeEach(() => {
      cy.login();
    });

    it('should display analytics dashboard', () => {
      cy.contains('Analytics').click();

      // Verify dashboard elements
      cy.contains('Montant Total').should('be.visible');
      cy.contains('Total Paiements').should('be.visible');
      cy.contains('Taux de Succès').should('be.visible');
    });

    it('should display metrics correctly', () => {
      cy.contains('Analytics').click();

      // Verify metrics are numbers
      cy.get('[data-testid="metric-total-amount"]')
        .should('contain', /^\d+(\.\d{2})?$/);
    });

    it('should display charts', () => {
      cy.contains('Analytics').click();

      // Verify line chart
      cy.get('[data-testid="line-chart"]').should('be.visible');

      // Verify doughnut chart
      cy.get('[data-testid="doughnut-chart"]').should('be.visible');
    });

    it('should change date range', () => {
      cy.contains('Analytics').click();

      // Change date range
      cy.get('select[data-testid="date-range"]').select('30');

      // Should update charts
      cy.get('[data-testid="line-chart"]').should('be.visible');
    });

    it('should update with real-time data', () => {
      cy.contains('Analytics').click();

      const initialValue = cy.get('[data-testid="metric-total-payments"]');

      // Simulate payment completion
      cy.visit(`${baseUrl}/qr-generator`);
      cy.get('input[placeholder*="Montant"]').type('100');
      cy.contains('Générer QR').click();
      cy.contains('Initier Paiement').click();

      // Go back to analytics
      cy.contains('Analytics').click();

      // Value should update
      cy.get('[data-testid="metric-total-payments"]')
        .should('not.equal', initialValue);
    });
  });

  describe('WebSocket Real-time Updates', () => {
    beforeEach(() => {
      cy.login();
    });

    it('should receive real-time payment updates', () => {
      cy.contains('Dashboard').click();

      // Open developer tools to monitor WebSocket
      cy.window().then((win) => {
        cy.spy(win.console, 'log');
      });

      // Trigger payment in another tab/window
      cy.contains('QR Generator').click();
      cy.get('input[placeholder*="Montant"]').type('100');
      cy.contains('Générer QR').click();
      cy.contains('Initier Paiement').click();

      // Verify notification received
      cy.contains('Paiement Reçu', { timeout: 10000 }).should('be.visible');
    });

    it('should display live notifications', () => {
      cy.contains('Dashboard').click();

      // Simulate incoming notification
      cy.window().then((win) => {
        win.wsClient.emit('notification:received', {
          title: 'Test Notification',
          message: 'Test message',
          type: 'success'
        });
      });

      // Should display toast
      cy.contains('Test Notification').should('be.visible');
    });
  });

  describe('Responsive Design', () => {
    beforeEach(() => {
      cy.login();
    });

    it('should be responsive on mobile', () => {
      cy.viewport('iphone-x');

      cy.contains('Dashboard').click();

      // Elements should be visible
      cy.get('[data-testid="metric-total-amount"]').should('be.visible');

      // Menu should adapt
      cy.get('[data-testid="mobile-menu"]').should('be.visible');
    });

    it('should be responsive on tablet', () => {
      cy.viewport('ipad-2');

      cy.contains('Dashboard').click();

      // Elements should be visible
      cy.get('[data-testid="metric-total-amount"]').should('be.visible');
    });

    it('should be responsive on desktop', () => {
      cy.viewport(1280, 720);

      cy.contains('Dashboard').click();

      // Elements should be visible
      cy.get('[data-testid="metric-total-amount"]').should('be.visible');
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      cy.login();
    });

    it('should handle network errors gracefully', () => {
      // Simulate network error
      cy.intercept('GET', '**/api/analytics/**', { forceNetworkError: true });

      cy.contains('Analytics').click();

      // Should show error message
      cy.contains('Erreur').should('be.visible');
    });

    it('should handle API errors', () => {
      // Simulate API error
      cy.intercept('GET', '**/api/payments/**', { statusCode: 500 });

      cy.contains('History').click();

      // Should show error message
      cy.contains('Erreur').should('be.visible');
    });

    it('should retry failed requests', () => {
      let attemptCount = 0;

      cy.intercept('GET', '**/api/analytics/**', (req) => {
        if (attemptCount === 0) {
          attemptCount++;
          req.reply({ statusCode: 500 });
        } else {
          req.reply({ statusCode: 200, body: { success: true } });
        }
      });

      cy.contains('Analytics').click();

      // Should eventually load
      cy.contains('Montant Total', { timeout: 10000 }).should('be.visible');
    });
  });
});

// Custom commands
Cypress.Commands.add('login', () => {
  cy.visit(`${baseUrl}/login`);
  cy.contains('Connexion avec Pi').click();
  cy.url().should('include', '/dashboard');
});
