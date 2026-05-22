import { Request, Response, NextFunction } from 'express';
import {
  getAllReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
  getReportsForExport,
  getDashboardStats,
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
    const data = req.body as CreateReportInput & { imageUrl?: string };

    if (req.file) {
      const ext = path.extname(req.file.originalname);
      const uniqueFileName = `reports/${req.file.filename}-${Date.now()}${ext}`;
      await storageService.uploadFile(req.file.buffer, uniqueFileName, req.file.mimetype);
      data.imageUrl = await storageService.getPresignedUrl(uniqueFileName);
    }

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
    const data = req.body as UpdateReportInput & { imageUrl?: string };
    
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

export const getDashboardHandler = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await getDashboardStats();
    return sendSuccess(res, stats, 'Dashboard stats fetched successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Escape a value for safe inclusion in a CSV cell.
 */
function escapeCsvField(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export const exportReportsCsvHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Parse optional month & year query params
    const monthParam = req.query.month ? Number(req.query.month) : undefined;
    const yearParam = req.query.year ? Number(req.query.year) : undefined;

    if (monthParam !== undefined && (isNaN(monthParam) || monthParam < 1 || monthParam > 12)) {
      return res.status(400).json({ success: false, message: 'Parameter month harus antara 1-12' });
    }
    if (yearParam !== undefined && (isNaN(yearParam) || yearParam < 2000)) {
      return res.status(400).json({ success: false, message: 'Parameter year tidak valid' });
    }

    const reports = await getReportsForExport(monthParam, yearParam);

    const CSV_HEADERS = [
      'ID',
      'Deskripsi',
      'Status',
      'Urgent',
      'Kategori',
      'Ruangan',
      'Lantai',
      'Gedung',
      'Pelapor',
      'Email Pelapor',
      'URL Gambar',
      'Tanggal Laporan',
    ];

    const rows = reports.map((r) => {
      const fields = [
        r.id,
        r.description ?? '',
        r.status ?? '',
        r.isUrgent ? 'Ya' : 'Tidak',
        r.categoryName ?? '',
        r.roomName ?? '',
        r.floor?.toString() ?? '',
        r.buildingName ?? '',
        r.reporterName ?? '',
        r.reporterEmail ?? '',
        r.imageUrl ?? '',
        r.createdAt ? new Date(r.createdAt).toLocaleDateString('id-ID') : '',
      ];
      return fields.map(escapeCsvField).join(',');
    });

    const csvContent = [CSV_HEADERS.join(','), ...rows].join('\n');

    // Build descriptive filename
    let fileLabel = 'semua';
    if (monthParam && yearParam) {
      fileLabel = `${MONTH_NAMES[monthParam - 1]}-${yearParam}`;
    } else if (yearParam) {
      fileLabel = `${yearParam}`;
    }
    const filename = `laporan-fasilitas-${fileLabel}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Prepend UTF-8 BOM so Excel opens the file with correct encoding
    return res.send('\uFEFF' + csvContent);
  } catch (error) {
    next(error);
  }
};
