import { Request, Response, NextFunction } from 'express';
import {
  getAllReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
} from './reports.service';
import { ReportByIdInput, CreateReportInput, UpdateReportInput } from './reports.schema';
import { sendSuccess } from '../../shared/utils/response';
import { storageService } from '../../shared/services/storage.service';
import crypto from 'crypto';
import path from 'path';

export const getReportsHandler = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const reports = await getAllReports();
    return sendSuccess(res, reports, 'Reports fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const getReportByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as unknown as ReportByIdInput;
    const report = await getReportById(id);
    return sendSuccess(res, report, 'Report fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const createReportHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body as CreateReportInput;
    
    if (req.file) {
      const ext = path.extname(req.file.originalname);
      const uniqueFileName = `reports/${crypto.randomUUID()}${ext}`;
      await storageService.uploadFile(req.file.buffer, uniqueFileName, req.file.mimetype);
      data.imageUrl = await storageService.getPresignedUrl(uniqueFileName);
    }
    
    const report = await createReport(data);
    return sendSuccess(res, report, 'Report created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateReportHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as unknown as ReportByIdInput;
    const data = req.body as UpdateReportInput;
    
    if (req.file) {
      const ext = path.extname(req.file.originalname);
      const uniqueFileName = `reports/${crypto.randomUUID()}${ext}`;
      await storageService.uploadFile(req.file.buffer, uniqueFileName, req.file.mimetype);
      data.imageUrl = await storageService.getPresignedUrl(uniqueFileName);
    }
    
    const report = await updateReport(id, data);
    return sendSuccess(res, report, 'Report updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteReportHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as unknown as ReportByIdInput;
    const report = await deleteReport(id);
    return sendSuccess(res, report, 'Report deleted successfully');
  } catch (error) {
    next(error);
  }
};
