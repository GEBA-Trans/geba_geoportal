USE [Custom]

/* verify Reciprocal  neighbours  */
SELECT 
    c.Country,
--		l.OmschrijvingNL,
		a.Path_ID,
    a.Neighbour,

    
    -- List of all neighbours of the Path_ID
    (SELECT STRING_AGG(Neighbour, ', ') 
     FROM dbo.svg_ctry_zip_EU_NB 
     WHERE Path_ID = a.Path_ID) AS PathID_Neighbours,

    -- List of all neighbours of the Neighbour
    (SELECT STRING_AGG(Neighbour, ', ') 
     FROM dbo.svg_ctry_zip_EU_NB 
     WHERE Path_ID = a.Neighbour) AS Neighbour_Neighbours

FROM dbo.svg_ctry_zip_EU_NB a (nolock)
LEFT JOIN dbo.svg_ctry_zip_EU_NB b (nolock)
    ON a.Path_ID = b.Neighbour AND a.Neighbour = b.Path_ID
LEFT JOIN dbo.svg_ctry_zip_EU c (nolock) on c.Path_ID = a.Path_ID
-- LEFT JOIN [Mitoz].dba.Land l (nolock) on l.IDLand = c.Country
WHERE b.Path_ID IS NULL
order by a .Path_ID 
