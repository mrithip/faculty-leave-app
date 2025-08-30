from django.http import HttpResponse
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from leave.models import LeaveRequest
from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import datetime

def generate_leave_pdf(request, leave_id):
    leave = get_object_or_404(LeaveRequest, id=leave_id)

    # Create the HttpResponse object with the appropriate PDF headers.
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="leave_request_{leave.user.username}_{leave.id}.pdf"'

    doc = SimpleDocTemplate(response, pagesize=letter)
    styles = getSampleStyleSheet()
    
    # Custom styles
    h1_style = ParagraphStyle(name='Heading1Custom', parent=styles['h1'], fontSize=18, leading=22, alignment=TA_CENTER, spaceAfter=20)
    body_text_left = ParagraphStyle(name='BodyTextLeft', parent=styles['BodyText'], alignment=TA_LEFT)
    body_text_bold = ParagraphStyle(name='BodyTextBold', parent=styles['BodyText'], fontName='Helvetica-Bold')
    body_text_centered = ParagraphStyle(name='BodyTextCentered', parent=styles['BodyText'], alignment=TA_CENTER)

    story = []

    # Title
    story.append(Paragraph("Leave Request Details", h1_style))
    story.append(Spacer(1, 0.2 * inch))

    # Date & Place
    story.append(Paragraph(f"<b>Date:</b> {timezone.now().strftime('%d %B %Y')}", body_text_left))
    story.append(Paragraph("<b>Place:</b> Sri Shakthi Institute of Engineering and Technology", body_text_left)) # Placeholder for place
    story.append(Spacer(1, 0.2 * inch))

    # Staff Name & Email
    story.append(Paragraph(f"<b>Staff Name:</b> {leave.user.username}", body_text_left))
    story.append(Paragraph(f"<b>Staff Email:</b> {leave.user.email}", body_text_left))
    story.append(Spacer(1, 0.2 * inch))

    # Leave Type & Reason
    story.append(Paragraph(f"<b>Leave Type:</b> {leave.get_leave_type_display()}", body_text_left))
    story.append(Paragraph(f"<b>Reason:</b> {leave.reason}", body_text_left))
    story.append(Spacer(1, 0.2 * inch))

    # From Date → To Date
    start_date_str = leave.start_date.strftime('%d %B %Y %H:%M')
    end_date_str = leave.end_date.strftime('%d %B %Y %H:%M')
    story.append(Paragraph(f"<b>From Date:</b> {start_date_str}", body_text_left))
    story.append(Paragraph(f"<b>To Date:</b> {end_date_str}", body_text_left))
    story.append(Paragraph(f"<b>Duration:</b> {leave.duration}", body_text_left))
    story.append(Spacer(1, 0.2 * inch))

    # Status
    status_display = leave.get_status_display()
    story.append(Paragraph(f"<b>Status:</b> {status_display}", body_text_left))
    story.append(Spacer(1, 0.2 * inch))

    # Who approved/rejected
    if leave.hod_approval:
        story.append(Paragraph(f"<b>HOD Approval:</b> Approved on {leave.hod_approval_date.strftime('%d %B %Y %H:%M')}", body_text_left))
    if leave.principal_approval:
        story.append(Paragraph(f"<b>Principal Approval:</b> Approved on {leave.principal_approval_date.strftime('%d %B %Y %H:%M')}", body_text_left))
    
    if leave.status == 'REJECTED':
        # Assuming a rejection reason might be stored or inferred.
        # For now, we'll just state it was rejected.
        story.append(Paragraph("<b>Rejection Details:</b> This leave request was rejected.", body_text_left))
        # If you have a specific rejection reason field, you would add it here:
        # story.append(Paragraph(f"<b>Reason for Rejection:</b> {leave.rejection_reason}", body_text_left))
    
    story.append(Spacer(1, 0.5 * inch))
    story.append(Paragraph("This document is for record-keeping purposes.", body_text_centered))

    doc.build(story)
    return response
