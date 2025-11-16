import { httpClient } from './config';

/**
 * Transaction API service
 */
export class TransactionAPI {
  /**
   * Get transaction history
   * @param {Object} params - Query parameters
   * @param {string} params.startDate - Start date in ISO format
   * @param {string} params.endDate - End date in ISO format
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 50)
   * @returns {Promise<Object>} Transaction history response
   */
  static async getTransactionHistory(params = {}) {
    try {
      const {
        startDate,
        endDate,
        page = 1,
        limit = 50
      } = params;

      const queryParams = {
        page,
        limit
      };

      // Add date filters if provided
      if (startDate) {
        queryParams.startDate = startDate;
      }
      if (endDate) {
        queryParams.endDate = endDate;
      }

      const response = await httpClient.get('/transaction/history', queryParams);
      return response;
    } catch (error) {
      console.error('Failed to fetch transaction history:', error);
      throw error;
    }
  }

  /**
   * Get transaction by ID
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<Object>} Transaction details
   */
  static async getTransactionById(transactionId) {
    try {
      const response = await httpClient.get(`/transaction/${transactionId}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch transaction:', error);
      throw error;
    }
  }

  /**
   * Get payment status by client transaction ID and transaction ID
   * @param {string} clientTxnId - Client transaction ID
   * @param {string} txnId - Transaction ID
   * @returns {Promise<Object>} Payment status response
   */
  static async getPaymentStatus(clientTxnId, txnId) {
    try {
      const response = await httpClient.get('/transaction/status', {
        client_txn_id: clientTxnId,
        txn_id: txnId
      });
      return response;
    } catch (error) {
      console.error('Failed to fetch payment status:', error);
      throw error;
    }
  }

  /**
   * Get order history
   * @param {Object} params - Query parameters
   * @param {string} params.startDate - Start date in ISO format
   * @param {string} params.endDate - End date in ISO format
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 50)
   * @returns {Promise<Object>} Order history response
   */
  static async getOrderHistory(params = {}) {
    try {
      const {
        startDate,
        endDate,
        page = 1,
        limit = 50
      } = params;

      const queryParams = {
        page,
        limit
      };

      // Add date filters if provided
      if (startDate) {
        queryParams.startDate = startDate;
      }
      if (endDate) {
        queryParams.endDate = endDate;
      }

      const response = await httpClient.get('/order/history', queryParams);
      return response;
    } catch (error) {
      console.error('Failed to fetch order history:', error);
      throw error;
    }
  }

  /**
   * Get order by ID
   * @param {string} orderId - Order ID
   * @returns {Promise<Object>} Order details
   */
  static async getOrderById(orderId) {
    try {
      const response = await httpClient.get(`/order/${orderId}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch order:', error);
      throw error;
    }
  }

  /**
   * Get wallet ledger
   * @param {Object} params - Query parameters
   * @param {string} params.startDate - Start date in ISO format
   * @param {string} params.endDate - End date in ISO format
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 50)
   * @returns {Promise<Object>} Wallet ledger response
   */
  static async getWalletLedger(params = {}) {
    try {
      const {
        startDate,
        endDate,
        page = 1,
        limit = 50
      } = params;

      const queryParams = {
        page,
        limit
      };

      // Add date filters if provided
      if (startDate) {
        queryParams.startDate = startDate;
      }
      if (endDate) {
        queryParams.endDate = endDate;
      }

      const response = await httpClient.get('/wallet/ledger', queryParams);
      return response;
    } catch (error) {
      console.error('Failed to fetch wallet ledger:', error);
      throw error;
    }
  }

  /**
   * Get default date range (last 30 days)
   * @returns {Object} Date range object
   */
  static getDefaultDateRange() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };
  }

  /**
   * Format transaction for display
   * @param {Object} transaction - Raw transaction data
   * @returns {Object} Formatted transaction
   */
  static formatTransaction(transaction) {
    const {
      _id,
      orderId,
      amount,
      paymentNote,
      status,
      gatewayType,
      createdAt,
      updatedAt,
      payerUpi,
      utr,
      gatewayResponse,
      gatewayOrderId
    } = transaction;

    return {
      id: _id,
      orderId,
      amount,
      paymentNote,
      status,
      gatewayType,
      createdAt,
      updatedAt,
      gatewayOrderId,
      payerUpi,
      utr,
      // Normalize to the field the UI expects
      txnId: utr || null,
      gatewayResponse,
      // Additional computed fields
      formattedAmount: `₹${amount}`,
      formattedDate: new Date(createdAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      statusColor: status === 'success' ? 'text-green-400' : 
                   status === 'pending' ? 'text-yellow-400' : 
                   'text-red-400',
      statusBg: status === 'success' ? 'bg-green-900/30' : 
                status === 'pending' ? 'bg-yellow-900/30' : 
                'bg-red-900/30'
    };
  }

  /**
   * Format order for display
   * @param {Object} order - Raw order data
   * @returns {Object} Formatted order
   */
  static formatOrder(order) {
    const {
      _id,
      orderType,
      orderId,
      amount,
      currency,
      status,
      paymentMethod,
      items,
      description,
      createdAt,
      updatedAt,
      apiResults
    } = order;

    // Parse description if it's a JSON string
    let parsedDescription = description;
    try {
      parsedDescription = JSON.parse(description);
    } catch (e) {
      // Keep original description if parsing fails
    }

    // Get order type display name
    const getOrderTypeDisplay = (type) => {
      switch (type) {
        case 'diamond_pack_purchase':
          return 'Diamond Pack';
        case 'coin_pack_purchase':
          return 'Coin Pack';
        case 'item_purchase':
          return 'Item Purchase';
        default:
          return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      }
    };

    // Get status display and colors
    const getStatusInfo = (status) => {
      switch (status) {
        case 'completed':
          return {
            color: 'text-green-400',
            bg: 'bg-green-900/30',
            icon: 'success'
          };
        case 'pending':
          return {
            color: 'text-yellow-400',
            bg: 'bg-yellow-900/30',
            icon: 'pending'
          };
        case 'failed':
          return {
            color: 'text-red-400',
            bg: 'bg-red-900/30',
            icon: 'failed'
          };
        default:
          return {
            color: 'text-gray-400',
            bg: 'bg-gray-900/30',
            icon: 'unknown'
          };
      }
    };

    const statusInfo = getStatusInfo(status);

    return {
      id: _id,
      orderType,
      orderId,
      amount,
      currency,
      status,
      paymentMethod,
      items,
      description: parsedDescription,
      createdAt,
      updatedAt,
      apiResults,
      // Additional computed fields
      formattedAmount: `₹${amount}`,
      formattedDate: new Date(createdAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      orderTypeDisplay: getOrderTypeDisplay(orderType),
      statusColor: statusInfo.color,
      statusBg: statusInfo.bg,
      statusIcon: statusInfo.icon,
      itemCount: items ? items.length : 0,
      totalItems: items ? items.reduce((sum, item) => sum + item.quantity, 0) : 0
    };
  }

  /**
   * Format ledger entry for display
   * @param {Object} ledgerEntry - Raw ledger entry data
   * @returns {Object} Formatted ledger entry
   */
  static formatLedgerEntry(ledgerEntry) {
    const {
      _id,
      transactionType,
      amount,
      balanceBefore,
      balanceAfter,
      reference,
      referenceType,
      description,
      metadata,
      status,
      createdAt,
      updatedAt
    } = ledgerEntry;

    // Get transaction type display info
    const getTransactionTypeInfo = (type) => {
      switch (type) {
        case 'credit':
          return {
            color: 'text-green-400',
            bg: 'bg-green-900/30',
            icon: 'credit',
            prefix: '+'
          };
        case 'debit':
          return {
            color: 'text-red-400',
            bg: 'bg-red-900/30',
            icon: 'debit',
            prefix: '-'
          };
        default:
          return {
            color: 'text-gray-400',
            bg: 'bg-gray-900/30',
            icon: 'unknown',
            prefix: ''
          };
      }
    };

    const typeInfo = getTransactionTypeInfo(transactionType);

    return {
      id: _id,
      transactionType,
      amount,
      balanceBefore,
      balanceAfter,
      reference,
      referenceType,
      description,
      metadata,
      status,
      createdAt,
      updatedAt,
      // Additional computed fields
      formattedAmount: `${typeInfo.prefix}₹${amount}`,
      formattedDate: new Date(createdAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      typeColor: typeInfo.color,
      typeBg: typeInfo.bg,
      typeIcon: typeInfo.icon,
      typePrefix: typeInfo.prefix,
      // Extract useful metadata
      gateway: metadata?.gateway || 'Unknown',
      paymentMethod: metadata?.paymentMethod || 'Unknown',
      utr: metadata?.utr || null,
      orderId: metadata?.orderId || null,
      originalTransactionId: metadata?.originalTransactionId || null
    };
  }
}

export default TransactionAPI;
