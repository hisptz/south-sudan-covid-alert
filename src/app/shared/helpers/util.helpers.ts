



export function removeAnalyticsheaders(analytics, headersToRemove) {
    const newAnalytics = {...analytics };
    headersToRemove.forEach(head => {
        const dataIndex = newAnalytics.headers.map(e => e.column).indexOf(head);
        const headerItem = newAnalytics.headers[dataIndex];
        // splice analytics headers
        newAnalytics.headers = newAnalytics.headers.filter(header => header.column !== headerItem.column);
        newAnalytics.rows = (newAnalytics.rows || []).map(row => {
            const newRow =  [];
            row.forEach((item, index) => {
                if (index !== dataIndex) {
                    newRow.push(item);
                }
            });
            return newRow;
        });
    });
    return newAnalytics;
}
