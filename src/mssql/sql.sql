USE master
#IF EXISTS(select * from sys.databases where name='Northwind') DROP DATABASE Northwind
Drop database if exists Northwind
Create database Northwind
Use Northwind

#BEGIN TRAN T1;Drop table [Northwind].[dbo].[t1];Drop table [Northwind].[dbo].[t2];COMMIT TRAN T1
Drop table [Northwind].[dbo].[Categories]
Drop table [Northwind].[dbo].[Products]

#BEGIN TRAN T2;Create table [Northwind].[dbo].[t1]( [id] [smallint] NOT NULL, [text] [text] NULL ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY];Create table [Northwind].[dbo].[t2]( [id] [smallint] NOT NULL, [text] [text] NULL ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY];COMMIT TRAN T2
Create table [Northwind].[dbo].[Categories]( [id] [smallint] NOT NULL, [text] [text] NULL ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
Create table [Northwind].[dbo].[Products]( [id] [smallint] NOT NULL, [text] [text] NULL ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

Insert into [Northwind].[dbo].[Categories] (id, [text]) values(1,'HELLO')
Insert into [Northwind].[dbo].[Categories] (id, [text]) values(2,'HI')
Insert into [Northwind].[dbo].[Categories] (id, [text]) values(3,'HEY')
Insert into [Northwind].[dbo].[Products] (id, [text]) values(1,'HOWDY')