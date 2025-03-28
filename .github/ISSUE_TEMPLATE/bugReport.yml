name: 🐛 Bug Report
description: Report a bug in the PDF processing system
title: "[Bug]: "
labels: ["bug"]
assignees: []
body:
  - type: markdown
    attributes:
      value: |
        **Thanks for taking the time to report a bug!**  
        Please fill out the following details to help us reproduce and fix the issue.
  
  - type: input
    id: summary
    attributes:
      label: "Describe the issue"
      description: "A brief summary of the bug"
      placeholder: "Text extraction fails on certain PDFs..."
  
  - type: textarea
    id: steps
    attributes:
      label: "Steps to Reproduce"
      description: "What steps led to this issue?"
      placeholder: |
        1. Upload a PDF.
        2. Try extracting text.
        3. Observe the failure.
    validations:
      required: true

  - type: textarea
    id: expected
    attributes:
      label: "Expected Behavior"
      description: "What should have happened?"
      placeholder: "The system should have attempted OCR when text extraction failed."

  - type: textarea
    id: logs
    attributes:
      label: "Relevant Logs/Error Messages"
      description: "Copy-paste any console or server errors here."

  - type: dropdown
    id: priority
    attributes:
      label: "Priority"
      options:
        - "Low"
        - "Medium"
        - "High"
      default: 1
