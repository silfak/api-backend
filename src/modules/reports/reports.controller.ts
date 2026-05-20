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
    const reporterId = req.user!.id;
    const report = await createReport(data, reporterId);
    return sendSuccess(res, report, 'Report created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateReportHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as unknown as ReportByIdInput;
    const data = req.body as UpdateReportInput;
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
