from django.http import HttpResponse
from django.http import HttpResponse
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from leave.models import LeaveRequest
from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import datetime
from django.conf import settings
import os
import logging

# Get an instance of a logger
logger = logging.getLogger(__name__)

def generate_leave_pdf(request, leave_id):
    leave = get_object_or_404(LeaveRequest, id=leave_id)

    # Log leave object details for debugging
    logger.info(f"Generating PDF for Leave ID: {leave.id}")
    logger.info(f"User: {leave.user.username}, Email: {leave.user.email}")
    logger.info(f"Leave Type: {leave.leave_type}, Reason: {leave.reason}")
    logger.info(f"Start Date: {leave.start_date}, End Date: {leave.end_date}")
    logger.info(f"Status: {leave.status}")
    logger.info(f"HOD Approval: {leave.hod_approval}, Date: {leave.hod_approval_date}")
    logger.info(f"Principal Approval: {leave.principal_approval}, Date: {leave.principal_approval_date}")
    logger.info(f"HOD Signature Path: {os.path.join(settings.BASE_DIR, 'static', 'sign.png')}")
    logger.info(f"Principal Signature Path: {os.path.join(settings.BASE_DIR, 'static', 'sign2.png')}")
    logger.info(f"HOD Signature Exists: {os.path.exists(os.path.join(settings.BASE_DIR, 'static', 'sign.png'))}")
    logger.info(f"Principal Signature Exists: {os.path.exists(os.path.join(settings.BASE_DIR, 'static', 'sign2.png'))}")

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

    # Add a test paragraph to check if anything renders
    story.append(Paragraph("--- Test PDF Content ---", body_text_centered))
    story.append(Spacer(1, 0.2 * inch))

    # Title
    story.append(Paragraph("Leave Request Details", h1_style))
    story.append(Spacer(1, 0.2 * inch))

    # Date & Place
    story.append(Paragraph(f"<font name='Helvetica-Bold'>Date:</font> {timezone.now().strftime('%d %B %Y')}", body_text_left))
    story.append(Paragraph("<font name='Helvetica-Bold'>Place:</font> Sri Shakthi Institute of Engineering and Technology", body_text_left)) # Placeholder for place
    story.append(Spacer(1, 0.2 * inch))

    # Staff Name & Email
    story.append(Paragraph(f"<font name='Helvetica-Bold'>Staff Name:</font> {leave.user.username}", body_text_left))
    story.append(Paragraph(f"<font name='Helvetica-Bold'>Staff Email:</font> {leave.user.email}", body_text_left))
    story.append(Spacer(1, 0.2 * inch))

    # Leave Type & Reason
    story.append(Paragraph(f"<font name='Helvetica-Bold'>Leave Type:</font> {leave.get_leave_type_display()}", body_text_left))
    story.append(Paragraph(f"<font name='Helvetica-Bold'>Reason:</font> {leave.reason}", body_text_left))
    story.append(Spacer(1, 0.2 * inch))

    # From Date → To Date
    start_date_str = leave.start_date.strftime('%d %B %Y %H:%M')
    end_date_str = leave.end_date.strftime('%d %B %Y %H:%M')
    story.append(Paragraph(f"<font name='Helvetica-Bold'>From Date:</font> {start_date_str}", body_text_left))
    story.append(Paragraph(f"<font name='Helvetica-Bold'>To Date:</font> {end_date_str}", body_text_left))
    story.append(Paragraph(f"<font name='Helvetica-Bold'>Duration:</font> {leave.duration}", body_text_left))
    story.append(Spacer(1, 0.2 * inch))

    # Status
    status_display = leave.get_status_display()
    story.append(Paragraph(f"<font name='Helvetica-Bold'>Status:</font> {status_display}", body_text_left))
    story.append(Spacer(1, 0.2 * inch))

    # Who approved/rejected
    if leave.hod_approval:
        story.append(Paragraph(f"<font name='Helvetica-Bold'>HOD Approval:</font> Approved on {leave.hod_approval_date.strftime('%d %B %Y %H:%M')}", body_text_left))
    if leave.principal_approval:
        story.append(Paragraph(f"<font name='Helvetica-Bold'>Principal Approval:</font> Approved on {leave.principal_approval_date.strftime('%d %B %Y %H:%M')}", body_text_left))
    
    if leave.status == 'REJECTED':
        # Assuming a rejection reason might be stored or inferred.
        # For now, we'll just state it was rejected.
        story.append(Paragraph("<font name='Helvetica-Bold'>Rejection Details:</font> This leave request was rejected.", body_text_left))
        # If you have a specific rejection reason field, you would add it here:
        # story.append(Paragraph(f"<font name='Helvetica-Bold'>Reason for Rejection:</font> {leave.rejection_reason}</font>", body_text_left))
    
    story.append(Spacer(1, 0.5 * inch))

    # Add Signatures
    hod_signature_path = os.path.join(settings.BASE_DIR, 'static', 'sign.png')
    principal_signature_path = os.path.join(settings.BASE_DIR, 'static', 'sign2.png')

    # HOD Signature (only for staff leaves)
    if leave.user.role == 'STAFF':
        story.append(Paragraph("<font name='Helvetica-Bold'>HOD Signature:</font>", body_text_left))
        if leave.hod_approval and os.path.exists(hod_signature_path):
            hod_img = Image(hod_signature_path, width=1 * inch, height=0.5 * inch) 
            story.append(hod_img)
            story.append(Paragraph(f"Approved by HOD on {leave.hod_approval_date.strftime('%d %B %Y %H:%M')}", body_text_left))
        elif leave.hod_approval and not os.path.exists(hod_signature_path):
            story.append(Paragraph("<i>HOD Signature image not found.</i>", body_text_left))
        else:
            story.append(Paragraph("Not yet approved by HOD", body_text_left))
        story.append(Spacer(1, 0.3 * inch))

    # Principal Signature (for both staff and HOD leaves)    
    show_principal_signature = False
    principal_action_text = "Not yet approved by Principal"

    if leave.user.role == 'STAFF':
        # For staff, show principal signature if Principal has explicitly approved or rejected
        if leave.principal_approval: # Principal approved
            show_principal_signature = True
            principal_action_text = f"Approved by Principal on {leave.principal_approval_date.strftime('%d %B %Y %H:%M')}"
        elif leave.status == 'REJECTED' and leave.principal_approval == False and leave.hod_approval == True: # Principal rejected after HOD approval
            show_principal_signature = True
            principal_action_text = "Rejected by Principal"
    elif leave.user.role == 'HOD':
        # For HOD, show principal signature if Principal has explicitly approved or rejected
        if leave.principal_approval: # Principal approved
            show_principal_signature = True
            principal_action_text = f"Approved by Principal on {leave.principal_approval_date.strftime('%d %B %Y %H:%M')}"
        elif leave.status == 'REJECTED' and leave.principal_approval == False: # Principal rejected (HOD leaves go directly to Principal)
            show_principal_signature = True
            principal_action_text = "Rejected by Principal"

    story.append(Paragraph("<font name='Helvetica-Bold'>Principal Signature:</font>", body_text_left))
    if show_principal_signature and os.path.exists(principal_signature_path):
        principal_img = Image(principal_signature_path, width=1 * inch, height=0.5 * inch) 
        story.append(principal_img)
        story.append(Paragraph(principal_action_text, body_text_left))
    elif show_principal_signature and not os.path.exists(principal_signature_path):
        story.append(Paragraph("<i>Principal Signature image not found.</i>", body_text_left))
    else:
        story.append(Paragraph(principal_action_text, body_text_left))
    story.append(Spacer(1, 0.5 * inch))

    story.append(Paragraph("This document is for record-keeping purposes.", body_text_centered))

    doc.build(story)
    return response
