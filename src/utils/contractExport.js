import { Document, Packer, Paragraph, TextRun, Table, TableCell, TableRow, HeadingLevel, AlignmentType, WidthType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';

export const generateContractDocument = async (contract) => {
    const sections = [];

    // Title
    sections.push(
        new Paragraph({
            text: `Contract Summary - ${contract.contract_name || 'Unnamed Contract'}`,
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
        })
    );

    // Contract Information Section
    sections.push(
        new Paragraph({
            text: 'Contract Information',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 200 }
        })
    );

    const contractInfo = [
        ['Contract ID:', contract.id || contract.contract_id || 'N/A'],
        ['Contract Name:', contract.contract_name || 'N/A'],
        ['Client Name:', contract.client_name || 'N/A'],
        ['Client ID:', contract.client_id || 'N/A'],
        ['Start Date:', contract.start_date ? new Date(contract.start_date).toLocaleString() : 'N/A'],
        ['End Date:', contract.end_date ? new Date(contract.end_date).toLocaleString() : 'N/A'],
        ['Status:', contract.is_archived ? 'Archived' : 'Active'],
        ['Created At:', contract.created_at ? new Date(contract.created_at).toLocaleString() : 'N/A'],
        ['Updated At:', contract.updated_at ? new Date(contract.updated_at).toLocaleString() : 'N/A']
    ];

    contractInfo.forEach(([label, value]) => {
        sections.push(
            new Paragraph({
                children: [
                    new TextRun({ text: label, bold: true }),
                    new TextRun({ text: ` ${value}` })
                ],
                spacing: { after: 100 }
            })
        );
    });

    // Subscriptions Section
    if (contract.subscriptions && contract.subscriptions.length > 0) {
        sections.push(
            new Paragraph({
                text: 'Subscriptions',
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 400, after: 200 }
            })
        );

        contract.subscriptions.forEach((subscription, subIndex) => {
            // Subscription Header
            sections.push(
                new Paragraph({
                    text: `Subscription ${subIndex + 1}: ${subscription.product?.api_name || 'Unknown Product'}`,
                    heading: HeadingLevel.HEADING_3,
                    spacing: { before: 300, after: 150 }
                })
            );

            // Subscription Details
            const pricingInfo = subscription.pricing_type === 'Fixed'
                ? 'Fixed'
                : `${subscription.pricing_type}-${subscription.strategy}`;

            sections.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: 'Subscription ID: ', bold: true }),
                        new TextRun({ text: subscription.id || 'N/A' })
                    ],
                    spacing: { after: 100 }
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: 'Pricing: ', bold: true }),
                        new TextRun({ text: pricingInfo })
                    ],
                    spacing: { after: 200 }
                })
            );

            // Rate Cards
            if (subscription.rate_cards && subscription.rate_cards.length > 0) {
                sections.push(
                    new Paragraph({
                        text: 'Rate Cards',
                        heading: HeadingLevel.HEADING_4,
                        spacing: { before: 200, after: 150 }
                    })
                );

                subscription.rate_cards.forEach((rateCard, rcIndex) => {
                    sections.push(
                        new Paragraph({
                            children: [
                                new TextRun({ text: `Rate Card ${rcIndex + 1}: `, bold: true }),
                                new TextRun({
                                    text: `${new Date(rateCard.start_date).toLocaleDateString()} - ${new Date(rateCard.end_date).toLocaleDateString()}`
                                })
                            ],
                            spacing: { before: 150, after: 100 }
                        })
                    );

                    // Tiers Table
                    if (rateCard.tiers && rateCard.tiers.length > 0) {
                        const tierRows = [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [new Paragraph({ text: 'Min Calls', bold: true })],
                                        width: { size: 33, type: WidthType.PERCENTAGE }
                                    }),
                                    new TableCell({
                                        children: [new Paragraph({ text: 'Max Calls', bold: true })],
                                        width: { size: 33, type: WidthType.PERCENTAGE }
                                    }),
                                    new TableCell({
                                        children: [new Paragraph({ text: 'Unit Price', bold: true })],
                                        width: { size: 34, type: WidthType.PERCENTAGE }
                                    })
                                ]
                            })
                        ];

                        rateCard.tiers.forEach(tier => {
                            const maxCalls = tier.max_calls === -1 ? '∞' : tier.max_calls.toString();
                            const unitPrice = parseFloat(tier.unit_price) || 0;
                            tierRows.push(
                                new TableRow({
                                    children: [
                                        new TableCell({
                                            children: [new Paragraph(tier.min_calls.toString())],
                                            width: { size: 33, type: WidthType.PERCENTAGE }
                                        }),
                                        new TableCell({
                                            children: [new Paragraph(maxCalls)],
                                            width: { size: 33, type: WidthType.PERCENTAGE }
                                        }),
                                        new TableCell({
                                            children: [new Paragraph(`$${unitPrice.toFixed(2)}`)],
                                            width: { size: 34, type: WidthType.PERCENTAGE }
                                        })
                                    ]
                                })
                            );
                        });

                        sections.push(
                            new Table({
                                rows: tierRows,
                                width: { size: 100, type: WidthType.PERCENTAGE }
                            }),
                            new Paragraph({ text: '', spacing: { after: 200 } })
                        );
                    } else {
                        sections.push(
                            new Paragraph({
                                text: 'No tiers defined for this rate card.',
                                italics: true,
                                spacing: { after: 200 }
                            })
                        );
                    }
                });
            } else {
                sections.push(
                    new Paragraph({
                        text: 'No rate cards defined for this subscription.',
                        italics: true,
                        spacing: { after: 200 }
                    })
                );
            }
        });
    } else {
        sections.push(
            new Paragraph({
                text: 'No subscriptions found for this contract.',
                italics: true,
                spacing: { before: 200 }
            })
        );
    }

    // Create document
    const doc = new Document({
        sections: [{
            properties: {},
            children: sections
        }],
        styles: {
            default: {
                document: {
                    run: {
                        font: 'Calibri'
                    },
                    paragraph: {
                        font: 'Calibri'
                    }
                }
            }
        }
    });

    // Generate and download
    const blob = await Packer.toBlob(doc);
    const fileName = `Contract_${contract.contract_name || contract.id}_${new Date().toISOString().split('T')[0]}.docx`;
    saveAs(blob, fileName);
};
